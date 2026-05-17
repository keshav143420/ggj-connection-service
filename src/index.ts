import app from "./app";
import { AppDataSource } from "./data-source";
import { kafkaProducer } from "./kafka/producer";

const PORT = process.env.PORT || 3000;

export async function bootstrap() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        await kafkaProducer.connect();
        console.log("Kafka producer connected!");

        const server = app.listen(PORT, () => {
            console.log(`Connection service running on port ${PORT}`);
        });

        return server;
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        process.exit(1);
    }
}

// Only execute bootstrap if run directly (not imported as a module)
if (require.main === module) {
    bootstrap();
}
