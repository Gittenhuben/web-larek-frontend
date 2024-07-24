import { TItemId, TItem, TItemView, IItemsList } from "../../types";
import { CDN_URL, CDN_IMAGES_FORMAT } from '../../utils/constants';
import { getPriceString } from '../../utils/utils';


export class ItemsList implements IItemsList {
  protected items: TItemView[] = [];

  setItems(items: TItem[]): void {
    this.items = [];
    items.forEach(item => {
      this.items.push({...item,
                       priceString: getPriceString(item.price),
                       imageLink: this.getImageLink(item.image, CDN_URL, CDN_IMAGES_FORMAT),
                       categoryClass: this.getCategoryClass(item.category)
    })});
  }
  
  getAllItems(): TItemView[] {
    return this.items;
  }

  getItems(itemIds: TItemId[]): TItemView[] {
    return this.items.filter(item => itemIds.some(itemId => itemId === item.id));
  }

  getItem(itemId: TItemId): TItemView {
    return this.items.find(item => item.id === itemId);
  }

  protected getCategoryClass(category: string): string {
    let categoryClass: string = '';

    switch(category) {
      case 'софт-скил':
        categoryClass = 'card__category_soft';
        break;
      case 'дополнительное':
        categoryClass = 'card__category_additional';
        break;
      case 'кнопка':
        categoryClass = 'card__category_button';
        break;
      case 'хард-скил':
        categoryClass = 'card__category_hard';
        break;
      case 'другое':
      default:
        categoryClass = 'card__category_other';
        break;
    }

    return categoryClass;
  }

  protected getImageLink(image: string, cdnUrl: string, imageFormat: string): string {
    return cdnUrl + image.replace('.svg', '.' + imageFormat);
  }
}
