import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
    if (connection.isConnected) {
        console.log('DB EXIST');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log('DB CONNECTED');
    } catch (error) {
        console.error('DB FAILED', error);
        process.exit(1);
    }
}

export default connectDB;