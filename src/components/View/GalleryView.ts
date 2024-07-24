import { TItemElement } from "../../types";
import { IEvents } from "../base/events";


export class GalleryView {
  protected container: DocumentFragment;
  protected parent: HTMLElement;
  protected events: IEvents;

  constructor(parent: HTMLElement, events: IEvents) {
    this.container = document.createDocumentFragment();
    this.parent = parent;
    this.events = events;
  }

  setItems(items: TItemElement[]): void {
    items.forEach(item => {
      item.element.firstElementChild.addEventListener('click', () => {
        this.events.emit('gallery:click', {id: item.id});
      });
      this.container.append(item.element);
    });
  }

  render(): void {
    this.parent.append(this.container);
  }
}
