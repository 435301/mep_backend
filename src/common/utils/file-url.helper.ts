

export class FileUrlHelper {
  static getUrl(path?: string | null): string | null {
    return path ? `${process.env.BASE_URL}/uploads/${path}` : null;
  }

  static mapArray<T extends { icon?: string | null }>(items: T[]): T[] {
    return items.map(item => ({
      ...item,
      icon: this.getUrl(item.icon),
    }));
  }
}