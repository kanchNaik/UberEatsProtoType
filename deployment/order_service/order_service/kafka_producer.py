from confluent_kafka import Producer
import json

producer_config = {
    'bootstrap.servers': 'ubereats-cluster-kafka-bootstrap.kafka:9092'
}

producer = Producer(producer_config)

def publish_order_created(order_data):
    producer.produce('order-created', key=str(order_data['id']), value=json.dumps(order_data))
    producer.flush()

def publish_updated_order(order_data):
    producer.produce('order-updated', key=str(order_data['id']), value=json.dumps(order_data))
    producer.flush()