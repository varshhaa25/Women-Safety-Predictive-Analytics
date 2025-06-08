from twilio.rest import Client

def send_sms_alert():
    # Replace with your actual Twilio Account SID and Auth Token
    account_sid = "ACd128f62d9d48d3e9688bca4df8b88ba3"  # Twilio Account SID
    auth_token = "9381d561b2419f417e43cd1bae4c201f"  # Twilio Auth Token
    
    client = Client(account_sid, auth_token)

    # Twilio phone number (must be from Twilio Console)
    from_number = "+15202772871"  
    
    # Recipient's phone number (must be verified in Twilio if on a free account)
    to_number = "+919345599722"  

    try:
        message = client.messages.create(
            body="🚨 Emergency Alert! The user is in danger. 🚨",
            from_=from_number,
            to=to_number
        )
        print("✅ Alert sent successfully! Message SID:", message.sid)
    
    except Exception as e:
        print("❌ Failed to send SMS alert:", str(e))

# Test function
if __name__ == "__main__":
    send_sms_alert()
