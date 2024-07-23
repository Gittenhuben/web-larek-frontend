import { TItemView } from "../../types";
import { ItemView } from './ItemView';
import { IEvents } from "../base/events";

export class GalleryView {
  protected container: DocumentFragment;
  protected parent: HTMLElement;
  protected template: HTMLTemplateElement;
  protected events: IEvents;

  constructor(parent: HTMLElement, template: HTMLTemplateElement, events: IEvents) {
    this.container = document.createDocumentFragment();
    this.parent = parent;
    this.template = template;
    this.events = events;
  }

  setItems(items: TItemView[]): void {
    items.forEach(item => {
      const itemView = new ItemView(this.template, item);
      const itemViewButton = itemView.get();
      itemViewButton.firstElementChild.addEventListener('click', () => {
        this.events.emit('gallery:click', {id: item.id});
      });
      this.container.append(itemViewButton);
    });
  }

  render(): void {
    this.parent.append(this.container);
  }
}
