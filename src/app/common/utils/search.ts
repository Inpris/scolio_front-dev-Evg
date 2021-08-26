export class SearchUtils {
  static extractName(searchTerm: string) {
    const [lastName, firstName, secondName] = (searchTerm != null ? searchTerm : '').replace(/\s+/g, ' ').trim().split(' ');
    return { lastName, firstName, secondName };
  }
}
