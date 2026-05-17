import { Kafka, Producer } from "kafkajs";

export class KafkaProducer {
    private producer: Producer;

    constructor() {
        const brokers = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");
        const kafka = new Kafka({
            clientId: "connection-service",
            brokers,
        });
        this.producer = kafka.producer();
    }

    async connect(): Promise<void> {
        await this.producer.connect();
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }

    async emitConnectionCreated(followerId: string, followingId: string): Promise<void> {
        await this.producer.send({
            topic: "connection-created",
            messages: [
                {
                    key: followerId, // Distribute partitions by follower
                    value: JSON.stringify({ followerId, followingId, timestamp: new Date() }),
                },
            ],
        });
    }

    async emitConnectionDeleted(followerId: string, followingId: string): Promise<void> {
        await this.producer.send({
            topic: "connection-deleted",
            messages: [
                {
                    key: followerId,
                    value: JSON.stringify({ followerId, followingId, timestamp: new Date() }),
                },
            ],
        });
    }
}

export const kafkaProducer = new KafkaProducer();
