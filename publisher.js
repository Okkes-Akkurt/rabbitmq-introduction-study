const amqp = require('amqplib');
const data = require('./data.json');

const message = {
	description: 'Bu bir test mesajıdır.',
};

const queueName = process.argv[2] || 'jobsQueue';
console.log('queueName : ', queueName);

const connectRabbitmq = async () => {
	try {
		//Connetcion and channel creating
		const connection = await amqp.connect('amqp://localhost:5672');
		const channel = await connection.createChannel();

		data.forEach((element) => {
			message.description = element.id;
			channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
			console.log('Gönderilen mesaj : ', message.description);
		});

		//channel-job connection creating and data sending to before cretated channel
		const assertion = await channel.assertQueue(queueName);
		/* setInterval(() => {
            message.description = new Date().getTime();
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log("Gönderilen mesaj : ",message)
        }, 10); */
	} catch (error) {
		console.log('Error ::', error);
	}
};

connectRabbitmq();
