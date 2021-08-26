export class ReportHelper {

  static createFilterParams(filterMap) {
    const filters = [];
    Object.keys(filterMap).forEach((key) => {
      if (!filterMap[key]) { return; }
      filterMap[key].queries.forEach((query) => {
        if (!query || query.value === null) { return; }
        filters.push({
          Operator: query.operator,
          Value: query.value,
          DataIndex: key,
        });
      });
    });
    return {
      filters,
    };
  }

}
