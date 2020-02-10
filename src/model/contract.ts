export class ContractGuarantees {
  data: { [guarantee: string]: ContractGuarantee } = {};

  static fromInput(input: any): ContractGuarantees {
    let result = new ContractGuarantees();
    Object.entries(input).forEach(([guarantee_name, guarantee_data]) =>
      result.addGuarantee(
        guarantee_name,
        ContractGuarantee.fromInput(guarantee_data)
      )
    );
    return result;
  }

  addGuarantee(guarantee_name: string, guarantee_data: ContractGuarantee) {
    this.data[guarantee_name] = ContractGuarantee.fromInput(guarantee_data);
  }

  sum(): ContractGuarantee {
    return Object.entries(this.data)
      .map(([guarantee, value]) => value)
      .reduce(
        (previous, current) => previous.plus(current),
        new ContractGuarantee()
      );
  }

  toJSON() {
    return this.data;
  }
}

export class ContractGuarantee {
  premium: number = 0;
  tax: number = 0;
  discount: number = 0;
  brokerFee: number = 0;
  costAcquisition: number = 0;

  static fromInput(input: any): ContractGuarantee {
    let result = new ContractGuarantee();
    result.premium = input.premium;
    result.tax = input.tax;
    result.discount = input.discount;
    result.brokerFee = input.broker_fee;
    result.costAcquisition = input.cost_acquisition;
    return result;
  }

  plus(value: ContractGuarantee): ContractGuarantee {
    let result = new ContractGuarantee();
    result.premium = this.premium + value.premium;
    result.tax = this.tax + value.tax;
    result.discount = this.discount + value.discount;
    result.brokerFee = this.brokerFee + value.brokerFee;
    result.costAcquisition = this.costAcquisition + value.costAcquisition;
    return result;
  }

  toOutput(): any {
    let output: any = {};

    output.premium = this.premium;
    output.tax = this.tax;
    output.discount = this.discount;
    output.broker_fee = this.brokerFee;
    output.cost_acquisition = this.costAcquisition;

    return output;
  }
}

export class EntityIndividual {
  type: "individual" = "individual";
  name: string;
  address: string;
  email: string;
  phone: string;
  birthday: string;

  static fromInput(input: any): EntityIndividual {
    let entitiy = new EntityIndividual();

    entitiy.type = input.type;
    entitiy.name = input.name;
    entitiy.address = input.address;
    entitiy.email = input.email;
    entitiy.phone = input.phone;
    entitiy.birthday = input.birthday;

    return entitiy;
  }
}

export class EntityCompany {
  type: "company" = "company";
  name: string;
  registration: string;
  representative: string;
  address: string;
  email: string;
  phone: string;
  birthday: string;
  static fromInput(input: any): EntityCompany {
    let entity = new EntityCompany();
    entity.type = input.type;
    entity.name = input.name;
    entity.registration = input.registration;
    entity.representative = input.representative;
    entity.address = input.address;
    entity.email = input.email;
    entity.phone = input.phone;
    entity.birthday = input.birthday;
    return entity;
  }
}

export class EntityNonProfit {
  type: "nonprofit" = "nonprofit";
  name: string;
  registration: string;
  representative: string;
  address: string;
  email: string;
  phone: string;
  birthday: string;
  static fromInput(input: any): EntityCompany {
    let entity = new EntityCompany();
    entity.type = input.type;
    entity.name = input.name;
    entity.registration = input.registration;
    entity.representative = input.representative;
    entity.address = input.address;
    entity.email = input.email;
    entity.phone = input.phone;
    entity.birthday = input.birthday;
    return entity;
  }
}

export type Entity = EntityIndividual | EntityCompany | EntityNonProfit;

const entityCreate = (input: any) => {
  switch (input.type) {
    case "individual":
      return EntityIndividual.fromInput(input);
    case "company":
      return EntityCompany.fromInput(input);
    case "nonprofit":
      return EntityNonProfit.fromInput(input);
  }
};

export class Contract {
  portfolio_id: string;
  id: string;
  product_id: string;

  event_num: number;
  event_type: "new" | "update" | "cancel";
  event_date: string;

  ref: string;
  debug?: string;

  customer_id: string;
  creation_date: string;
  last_update: string;
  subscriber: Entity[] = [];
  insured: Entity[] = [];
  beneficiary: Entity[] = [];
  splitting_type?: string;
  splitting_fee?: number;
  subscription_date: string;
  issuance_date: string;
  start_cover_date: string;
  end_cover_date: string;
  coinsurance?: number;
  extra_broker_fee?: number;
  cancel_date?: string;
  cancel_reason?: string;
  guarantees: ContractGuarantees = new ContractGuarantees();
  product_data: any = {};

  static fromInput(input: any): Contract {
    let contract = new Contract();

    contract.portfolio_id = input.portfolio_id;
    contract.id = input.id;
    contract.product_id = input.product_id;
    contract.event_num = input.event_num;
    contract.event_type = input.event_type;
    contract.event_date = input.event_date;
    contract.ref = input.ref;
    contract.debug = input.debug;
    contract.customer_id = input.customer_id;
    contract.creation_date = input.creation_date;
    contract.last_update = input.last_update;
    contract.subscriber = input.subscriber.map((item: any) =>
      entityCreate(item)
    );
    contract.insured = input.insured.map((item: any) => entityCreate(item));
    contract.beneficiary = input.beneficiary.map((item: any) =>
      entityCreate(item)
    );
    contract.splitting_type = input.splitting_type;
    contract.splitting_fee = input.splitting_fee;
    contract.subscription_date = input.subscription_date;
    contract.issuance_date = input.issuance_date;
    contract.start_cover_date = input.start_cover_date;
    contract.end_cover_date = input.end_cover_date;
    contract.coinsurance = input.coinsurance;
    contract.extra_broker_fee = input.extra_broker_fee;
    contract.cancel_date = input.cancel_date;
    contract.cancel_reason = input.cancel_reason;
    contract.guarantees = ContractGuarantees.fromInput(input.guarantees);
    contract.product_data = input.product_data;

    return contract;
  }

  addGuarantee(guarantee_name: string, guarantee_data: ContractGuarantee) {
    this.guarantees.addGuarantee(guarantee_name, guarantee_data);
  }

  addSubscriber(entitiy: Entity) {
    this.subscriber.push(entitiy);
  }

  addInsured(entitiy: Entity) {
    this.insured.push(entitiy);
  }

  addBeneficiary(entitiy: Entity) {
    this.beneficiary.push(entitiy);
  }
}
