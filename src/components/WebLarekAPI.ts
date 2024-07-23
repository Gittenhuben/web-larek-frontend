import { TItemsAPI, TOrder, TOrderResult, IWebLarekAPI } from "../types";
import { Api } from "./base/api";


export class WebLarekAPI extends Api implements IWebLarekAPI {

	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

  getItems(): Promise<TItemsAPI> {
    return this.get<TItemsAPI>(`/product/`);
  }

  sendOrder(order: TOrder): Promise<TOrderResult> {
    return this.post<TOrderResult>('/order', order);
  }
}