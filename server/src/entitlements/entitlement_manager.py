
class Entitlement_Manager:

    @staticmethod 
    def fetch_entitlements(client,entitlement_type):
        conversions = {
            "skin_level": "e7c63390-eda7-46e0-bb7a-a6abdacd2433",
            "skin_chroma": "3ad1b2b2-acdb-4524-852f-954a76ddae0a",
            "agent": "01bb38e1-da47-4e6a-9b3d-945fe4655707",
            "contract_definition": "f85cb6f7-33e5-4dc8-b609-ec7212301948",
            "buddy": "dd3bf334-87f3-40bd-b043-682a57a8dc3a",
            "spray": "d5f120f8-ff8c-4aac-92ea-f2b5acbe9475",
            "player_card": "3f296c07-64c3-494c-923b-fe692a4fa1bd",
            "player_title": "de7caa6b-adf7-4588-bbd1-143831e786c6",
        }
        if conversions.get(entitlement_type):
            entitlements = client.store_fetch_entitlements(item_type=conversions.get(entitlement_type))
            return entitlements
        else:
            return None
