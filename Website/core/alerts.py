import time
import logging
from datetime import datetime
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


class AlertTracker:
    def __init__(self):
        self.consecutive_suspicious = 0
        self.suspicious_timestamps = []
        self.last_alert_time = 0
        self.total_suspicious = 0
        self.latest_label = "NORMAL"
        self.latest_score = None
        self.latest_updated_at = 0

    def record_prediction(self, is_suspicious):
        now = time.time()

        if is_suspicious:
            self.consecutive_suspicious += 1
            self.suspicious_timestamps.append(now)
            self.total_suspicious += 1
        else:
            self.consecutive_suspicious = 0

        # Clean old timestamps outside the frequency window
        window = settings.ALERT_CONFIG['FREQUENCY_WINDOW']
        self.suspicious_timestamps = [
            ts for ts in self.suspicious_timestamps if now - ts < window
        ]

    def should_trigger_alert(self):
        now = time.time()
        cooldown = settings.ALERT_CONFIG['ALERT_COOLDOWN']

        if now - self.last_alert_time < cooldown:
            return False

        consecutive_threshold = settings.ALERT_CONFIG['CONSECUTIVE_THRESHOLD']
        frequency_threshold = settings.ALERT_CONFIG['FREQUENCY_THRESHOLD']

        if self.consecutive_suspicious >= consecutive_threshold:
            return True

        if len(self.suspicious_timestamps) >= frequency_threshold:
            return True

        return False

    def mark_alert_sent(self):
        self.last_alert_time = time.time()

    def update_latest_status(self, label, score=None):
        self.latest_label = label
        self.latest_score = score
        self.latest_updated_at = time.time()

    def get_stats(self):
        return {
            'consecutive_suspicious': self.consecutive_suspicious,
            'recent_suspicious_count': len(self.suspicious_timestamps),
            'total_suspicious': self.total_suspicious,
            'last_alert_time': self.last_alert_time,
            'latest_label': self.latest_label,
            'latest_score': self.latest_score,
            'latest_updated_at': self.latest_updated_at,
        }


alert_tracker = AlertTracker()


def send_email_alert(prediction_score, camera_url=None):
    if not settings.ALERT_CONFIG.get('EMAIL_ENABLED', False):
        logger.info("Email alerts disabled")
        return False

    recipient = settings.ALERT_CONFIG.get('ALERT_EMAIL', '')
    if not recipient:
        logger.warning("No alert email configured")
        return False

    subject = "CRIME DETECTION ALERT - Suspicious Activity Detected"

    message = (
        f"ALERT: Suspicious activity has been detected by the surveillance system.\n\n"
        f"Details:\n"
        f"- Detection Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        f"- Confidence Score: {prediction_score:.2f}\n"
        f"- Total Suspicious Detections: {alert_tracker.total_suspicious}\n"
    )

    if camera_url:
        message += f"- Camera/Video: {camera_url}\n"

    message += (
        f"\nPlease review the footage immediately.\n"
        f"This is an automated alert from the Crime Detection System."
    )

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
        logger.info(f"Email alert sent to {recipient}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email alert: {str(e)}")
        return False


def send_sms_alert(prediction_score, camera_url=None):
    if not settings.ALERT_CONFIG.get('SMS_ENABLED', False):
        logger.info("SMS alerts disabled")
        return False

    try:
        from twilio.rest import Client
    except ImportError:
        logger.error("Twilio package not installed. Run: pip install twilio")
        return False

    account_sid = settings.ALERT_CONFIG.get('TWILIO_ACCOUNT_SID', '')
    auth_token = settings.ALERT_CONFIG.get('TWILIO_AUTH_TOKEN', '')
    twilio_number = settings.ALERT_CONFIG.get('TWILIO_PHONE_NUMBER', '')
    alert_number = settings.ALERT_CONFIG.get('ALERT_PHONE_NUMBER', '')

    if not all([account_sid, auth_token, twilio_number, alert_number]):
        logger.warning("Incomplete Twilio configuration")
        return False

    message_body = (
        f"CRIME ALERT: Suspicious activity detected! "
        f"Confidence: {prediction_score:.2f}. "
        f"Please check surveillance system immediately."
    )

    try:
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=message_body,
            from_=twilio_number,
            to=alert_number,
        )
        logger.info(f"SMS alert sent to {alert_number}")
        return True
    except Exception as e:
        logger.error(f"Failed to send SMS alert: {str(e)}")
        return False


def trigger_alerts(prediction_score, camera_url=None):
    email_sent = send_email_alert(prediction_score, camera_url)
    sms_sent = send_sms_alert(prediction_score, camera_url)

    return {
        'email_sent': email_sent,
        'sms_sent': sms_sent,
    }
