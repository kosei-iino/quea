//指定年月の最大日付を取得
const getSelectDay = (ansBirthYear,ansBirthMonth) =>
{
    const date = new Date(ansBirthYear, ansBirthMonth, 0);
    return date.getDate();
}
export default getSelectDay