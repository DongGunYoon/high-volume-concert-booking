import { Kafka, Producer, Consumer, Message } from 'kafkajs';
import { KafkaContainer, StartedKafkaContainer } from '@testcontainers/kafka';

jest.setTimeout(300000);

describe('카프카 테스트', () => {
  let kafkaContainer: StartedKafkaContainer;
  let producer: Producer;
  let consumer: Consumer;

  beforeAll(async () => {
    kafkaContainer = await new KafkaContainer().start();
    const kafkaBroker = `${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`;
    const kafka = new Kafka({
      clientId: 'test-client',
      brokers: [kafkaBroker],
    });

    producer = kafka.producer();
    consumer = kafka.consumer({ groupId: 'test-group' });

    await producer.connect();
    await consumer.connect();
  });

  afterAll(async () => {
    await producer.disconnect();
    await consumer.disconnect();
    await kafkaContainer.stop();
  });

  describe('카프카 메시지 발행', () => {
    it('카프카 메시지가 지정한 topic으로 성공적으로 발행됩니다.', async () => {
      const topic = 'producer-test-topic';
      const messages = [{ key: 'testKey', value: 'testValue' }];

      const sendResult = await producer.send({ topic, messages });

      expect(sendResult).toBeDefined();
      expect(sendResult[0].topicName).toBe(topic);
    });
  });

  describe('카프카 메시지 소비', () => {
    it('동일한 topic의 메시지가 발행되면 성공적으로 소비합니다.', async () => {
      const topic = 'test-topic';
      const message = { key: 'testKey', value: 'testValue' };

      await consumer.subscribe({ topic, fromBeginning: true });
      await producer.send({
        topic,
        messages: [{ key: message.key, value: JSON.stringify(message.value) }],
      });

      const consumedMessages: Message[] = [];
      await new Promise<void>((resolve, reject) => {
        consumer
          .run({
            eachMessage: async ({ topic, partition, message }) => {
              consumedMessages.push({
                key: message.key?.toString(),
                value: JSON.parse(message.value?.toString() || ''),
              });
              resolve();
            },
          })
          .catch(reject);
      });

      expect(consumedMessages).toHaveLength(1);
      expect(consumedMessages[0].key).toBe(message.key);
      expect(consumedMessages[0].value).toBe(message.value);
    });
  });
});
