// utils.js 文件内容

function generateUuid() {
  return crypto.randomUUID();
}

function formatDateTimeToUTCString(date) {
  
  // 修正：使用 date.getTime() 来检查 Date 对象是否有效
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error(
      "formatDateTimeToUTCString 接收到的参数 date 不是有效的 Date 对象!",
      date
    );
    return "Invalid Date";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); 
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const second = String(date.getUTCSeconds()).padStart(2, "0");
  
  // 关键修正：添加 'Z' 标记，表示 UTC 时间 (iCalendar 规范要求)
  const formattedDateTime = `${year}${month}${day}T${hour}${minute}${second}Z`; 
  
  return formattedDateTime; // 返回 格式化后的日期时间字符串
}

// 核心修正：添加 year 参数，并使用它来构建日期
function createUTCDateFromDateTextAndTime(dateText, timeStr, year) { 
  const [day, month] = dateText.split("/"); 
  const [hour, minute] = timeStr.split(":"); 

  if (typeof year !== 'number' || isNaN(year)) {
      console.warn("createUTCDateFromDateTextAndTime 缺少有效的年份参数，使用当前年份作为备份！");
      year = new Date().getFullYear(); 
  }

  // 步骤 1: 创建一个*本地* Date 对象来获取正确的时区偏移
  // JavaScript 会假设这是一个本地时间（例如 NZDT/NZST）
  const localDateForOffset = new Date(
    year, 
    parseInt(month) - 1, 
    parseInt(day), 
    parseInt(hour), 
    parseInt(minute), 
    0
  );

  // 步骤 2: 获取本地时区偏移（以分钟为单位），例如 NZDT 是 -780 分钟 (-13 小时)
  // getTimezoneOffset() 返回的是本地时间比 UTC 快多少分钟，但在南半球夏令时通常是负数。
  const timezoneOffsetMinutes = localDateForOffset.getTimezoneOffset(); // 例如 NZDT 返回 -780

  // 步骤 3: 重新计算 UTC 时间的小时数
  // 通过调整小时数来抵消本地时区偏移，从而得到一个在逻辑上等同于本地时间的 UTC Date 对象。
  // timeZoneOffsetMinutes/60 即为时区偏移的小时数
  const adjustedUTCHour = parseInt(hour) + (timezoneOffsetMinutes / 60);

  const utcDate = new Date(
    Date.UTC(
      year,
      parseInt(month) - 1, // 月份需要 -1
      parseInt(day),
      adjustedUTCHour, // 使用调整后的 UTC 小时
      parseInt(minute),
      0
    )
  ); 

  // 检查 Date 对象是否有效
  if (isNaN(utcDate.getTime())) { 
    console.error(`无法创建有效的日期: ${dateText} ${timeStr}, Year: ${year}`);
    return null; 
  }
  return utcDate; 
}