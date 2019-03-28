/**
 * Maps data back from the result of a database query.
 * DataLoader expects the return of an array with the
 * same length as the input array of ids.
 * The data at index `n` in the result array should
 * be that corresponding to the id at the same index `n`
 * within the input array.
 * 
 * Simply returning the result of the database query
 * would not always respect this.
 * 
 * @param ids Input array given by dataloader
 * @param rawData Result of the database query
 * @param getId Getter that returns the id of an item of rawData
 * @param getData Getter that returns the data of an item of rawData
 * @param emptyHandler Handler for the case that no data for an id is retrieved
 */
export function mapData<TId, TRawData, TData>(
  ids: TId[],
  rawData: TRawData[],
  getId: (rawData: TRawData) => TId,
  getData: (rawData: TRawData) => TData,
  emptyHandler: (id: TId) => TData | null,
) {
  const resultMap = new Map<TId, TData>();
  rawData.forEach(rd => {
    resultMap.set(getId(rd), getData(rd));
  });

  return ids.map(id => {
    const result = resultMap.get(id);
    if (result == null) {
      return emptyHandler(id);
    }
    return result;
  });
}
