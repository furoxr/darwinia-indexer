import {
  SubstrateEvent,
} from "@subql/types";
import { StakedEvent, UnstakedEvent, PayoutEvent, ElectedEvent } from "../types";
import { Balance } from "@polkadot/types/interfaces";

// export async function handleBlock(block: SubstrateBlock): Promise<void> {
//   //Create a new starterEntity with ID using block hash
//   let record = new StarterEntity(block.block.header.hash.toString(), 1);
//   //Record block number
//   record.field1 = block.block.header.number.toNumber();
//   await record.save();
// }

async function handleStaked(event: SubstrateEvent) {
  const {
    event: {
      data: [staker, ringAmount, ktonAmount, deposits],
    },
  } = event;
  const id = `${event.block.block.header.number}-${event.idx}`
  const record = new StakedEvent(id);
  record.timestamp = event.block.timestamp;
  record.blockNumber = event.block.block.header.number.toBigInt();
  record.blockHash = event.block.block.header.hash.toString();
  record.staker = staker.toString();
  record.ringAmount = (ringAmount as Balance).toBigInt();
  record.ktonAmount = (ktonAmount as Balance).toBigInt();
  logger.info("NADA: " + JSON.stringify(deposits.toJSON()));
  record.deposits = (deposits as unknown as Array<Balance>).map(ele => {
    return ele.toBigInt();
  });
  await record.save();
}

async function handleUnstaked(event: SubstrateEvent) {
  const {
    event: {
      data: [staker, ringAmount, ktonAmount, deposits],
    },
  } = event;
  const id = `${event.block.block.header.number}-${event.idx}`
  const record = new UnstakedEvent(id);
  record.timestamp = event.block.timestamp;
  record.blockNumber = event.block.block.header.number.toBigInt();
  record.blockHash = event.block.block.header.hash.toString();
  record.staker = staker.toString();
  record.ringAmount = (ringAmount as Balance).toBigInt();
  record.ktonAmount = (ktonAmount as Balance).toBigInt();
  record.deposits = (deposits.toJSON() as unknown as Array<Balance>).map(ele => {
    return (ele as Balance).toBigInt();
  });
  await record.save();
}

async function handlePayout(event: SubstrateEvent) {
  const {
    event: {
      data: [staker, ringAmount],
    },
  } = event;
  const id = `${event.block.block.header.number}-${event.idx}`
  const record = new PayoutEvent(id);
  record.timestamp = event.block.timestamp;
  record.blockNumber = event.block.block.header.number.toBigInt();
  record.blockHash = event.block.block.header.hash.toString();
  record.staker = staker.toString();
  record.ringAmount = (ringAmount as Balance).toBigInt();
  await record.save();
}

async function handleElected(event: SubstrateEvent) {
  const {
    event: {
      data: [collators],
    },
  } = event;
  const id = `${event.block.block.header.number}-${event.idx}`
  const record = new ElectedEvent(id);
  record.timestamp = event.block.timestamp;
  record.blockNumber = event.block.block.header.number.toBigInt();
  record.blockHash = event.block.block.header.hash.toString();
  record.collators = (collators.toJSON() as unknown as Array<string>);
  await record.save();
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  logger.info(`event! ${event}`);
  switch (event.event.method) {
    case "Staked":
      await handleStaked(event);
      break;
    case "Unstaked":
      await handleUnstaked(event);
      break;
    case "Payout":
      await handlePayout(event);
      break;
    case "Elected":
      await handleElected(event);
      break;
    default:
      break;
  }
}