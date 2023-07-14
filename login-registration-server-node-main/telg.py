import json
from telethon.sync import TelegramClient
from telethon.tl.types import MessageMediaWebPage

api_id = '20762849'
api_hash = '4a57461e0b3bf5eb408b06a0d02be62a'
session_name = 'mybot_session1'

client = TelegramClient(session_name, api_id, api_hash)

def extract_description(message):
    # Check if the message is not None
    if message is None:
        return ""

    # Check if the message has a text attribute
    if hasattr(message, 'text') and message.text is not None:
        # Check if the message has a URL in the text
        if isinstance(message.media, MessageMediaWebPage) and hasattr(message.media.webpage, 'url'):
            url = message.media.webpage.url
            # Remove the URL from the description
            description = message.text.replace(url, "").strip()
        else:
            description = message.text.strip()
    else:
        description = ""

    return description

def scrape_messages():
    with client:
        messages_dict = {}

        specific_groups = ['ctinow', 'reverseame', 'ZerodayExploitware', 'thehackernews']

        for group in specific_groups:
            entity = client.get_entity(group)
            messages = client.get_messages(entity, limit=80)
            group_messages = []

            for message in messages:
                message_data = {
                    'timestamp': message.date.strftime("%Y-%m-%d %H:%M:%S"),
                    'description': extract_description(message),
                    'reference': None
                }

                if isinstance(message.media, MessageMediaWebPage) and hasattr(message.media.webpage, 'url'):
                    message_data['reference'] = message.media.webpage.url

                group_messages.append(message_data)

            messages_dict[group] = group_messages

        with open('messages.json', 'w') as file:
            json.dump(messages_dict, file, indent=4)

    print("Scraping completed. Messages saved to 'messages.json'")

if __name__ == '__main__':
    scrape_messages()
