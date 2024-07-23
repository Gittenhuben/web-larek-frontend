export function getPriceString(price: number): string {
  let priceString: string = '';

  switch(true) {
    case price === null:
      priceString = 'Бесценно';
      break;
    case price % 100 >= 11 && price % 100 <= 19:
    case price % 10 < 1 || price % 10 > 4:
      priceString = price + ' синапсов';
      break;
    case price % 10 === 1:
      priceString = price + ' синапс';
      break;
    case price % 10 >= 2 && price % 10 <= 4:
      priceString = price + ' синапса';
      break;
  }

  return priceString;
}