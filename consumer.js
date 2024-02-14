const amqp = require('amqplib');
const data = require('./data.json');

const message = {
	description: 'Bu bir test mesajıdır.',
};

const queueName = process.argv[2] || 'jobsQueue';

const connectRabbitmq = async () => {
	try {
		//Connetcion and channel creating
		const connection = await amqp.connect('amqp://localhost:5672');
		const channel = await connection.createChannel();
		const assertion = await channel.assertQueue(queueName);

		console.log('Mesaj Bekleniyor...');
		channel.consume(queueName, (msg) => {
			const messageInfo = JSON.parse(msg.content.toString());
			const userInfo = data.find((user) => user.id == messageInfo.description);
			if (userInfo) {
				console.log('İşlenen kayıt : ', userInfo);
				channel.ack(msg);
			}
		});
	} catch (error) {
		console.log('Error ::', error);
	}
};

connectRabbitmq();
