// 定义一个初始的时间戳，作为雪花算法的基准时间点
const epoch = BigInt(1622476800000); // 2021 年 6 月 1 日
// 定义数据中心 ID 和工作节点 ID 的位数，这里假设都是 5 位
const dataCenterIdBits = 5n;
const workerIdBits = 5n;
// 定义序列号的位数，这里假设是 12 位
const sequenceBits = 12n;
// 计算机器标识的最大值，用于检查输入是否合法
const maxDataCenterId = -1n ^ (-1n << dataCenterIdBits); // 31
const maxWorkerId = -1n ^ (-1n << workerIdBits); // 31

// 计算时间戳，机器标识和序列号的位移量
const timestampShift = sequenceBits + dataCenterIdBits + workerIdBits; // 22
const dataCenterIdShift = sequenceBits + workerIdBits; // 17
const workerIdShift = sequenceBits; // 12

// 计算序列号的最大值，用于在同一毫秒内生成不同的 ID
const sequenceMask = -1n ^ (-1n << sequenceBits); // 4095

// 定义一个类来实现雪花算法
export class Snowflake {
  dataCenterId: bigint;
  workerId: bigint;
  lastTimestamp: bigint;
  sequence: bigint;

  // 构造函数，接受数据中心 ID 和工作节点 ID 作为参数，同时初始化上一次的时间戳和序列号
  constructor(dataCenterId: bigint, workerId: bigint) {
    // 检查数据中心 ID 和工作节点 ID 是否在合法范围内
    if (dataCenterId < 0n || dataCenterId > maxDataCenterId) {
      throw new Error("data center id is out of range");
    }
    if (workerId < 0n || workerId > maxWorkerId) {
      throw new Error("worker id is out of range");
    }
    // 给对象的属性赋值
    this.dataCenterId = dataCenterId;
    this.workerId = workerId;
    this.lastTimestamp = -1n;
    this.sequence = 0n;
  }
  // 生成 ID 的方法，返回一个 BigInt 类型的 ID
  nextId() {
    // 获取当前时间的毫秒数，转换为 BigInt 类型
    let timestamp = BigInt(Date.now());
    // 如果当前时间小于上一次的时间戳，说明系统时钟回拨，抛出异常
    if (timestamp < this.lastTimestamp) {
      throw new Error("clock moved backwards");
    }
    // 如果当前时间等于上一次的时间戳，说明在同一毫秒内生成多个 ID
    if (timestamp === this.lastTimestamp) {
      // 将序列号加一，并用序列号掩码进行按位与运算，确保序列号不超过最大值
      this.sequence = (this.sequence + 1n) & sequenceMask;
      // 如果序列号等于零，说明该毫秒内的序列号已经用完，需要等待下一毫秒
      if (this.sequence === 0n) {
        timestamp = this.waitNextMillisecond(timestamp);
      }
    } else {
      // 如果当前时间大于上一次的时间戳，说明进入了新的毫秒，重置序列号为零
      this.sequence = 0n;
    }

    // 更新上一次的时间戳为当前时间
    this.lastTimestamp = timestamp;
    // 按照雪花算法的规则，将时间戳减去初始时间戳，左移相应的位数，然后再加上数据中心 ID 左移相应的位数，再加上工作节点ID左移相应的位数，再加上序列号，得到最终的 ID，并返回
    return (
      ((timestamp - epoch) << timestampShift) +
      (this.dataCenterId << dataCenterIdShift) +
      (this.workerId << workerIdShift) +
      this.sequence
    );
  }

  // 等待下一毫秒的方法，返回一个 BigInt 类型的时间戳
  waitNextMillisecond(timestamp: bigint) {
    // 用一个循环来不断获取当前时间，直到大于给定的时间戳，然后返回
    while (timestamp <= this.lastTimestamp) {
      timestamp = BigInt(Date.now());
    }
    return timestamp;
  }
}

export default new Snowflake(1n, 1n);
