export class SearchItemModel {
  svgPath?: string;
  imgPath?: string;
  iconClasses?: string;
  title: string;
  description?: string;

  constructor({ svgPath, imgPath, iconClasses, title, description }) {
    this.svgPath = svgPath;
    this.imgPath = imgPath;
    this.iconClasses = iconClasses;
    this.title = title;
    this.description = description;
  }
}
