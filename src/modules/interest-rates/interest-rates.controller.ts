import {
  InterestRateService,
  interestRateService,
} from "./interest-rates.service";
import { BaseController } from "../../common/base/baseController";
import { InterestRate } from "./interest-rate.entity";

export class InterestRateController extends BaseController<InterestRate> {
  constructor() {
    super(interestRateService);
  }
}

export const interestRateController = new InterestRateController();
