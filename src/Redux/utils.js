export const convertDateFormat = (inputDate) => {
   const dateParts = inputDate.split("-");
   const year = parseInt(dateParts[0]);
   const month = parseInt(dateParts[1]) - 1;
   const day = parseInt(dateParts[2]);

   const formattedDate = new Date(year, month, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });

   return formattedDate;
};

const getFormattedDate = () => {
   const today = new Date();
   const year = today.getFullYear();
   const month = String(today.getMonth() + 1).padStart(2, "0");
   const day = String(today.getDate()).padStart(2, "0");

   const oneMonthAgo = new Date();
   oneMonthAgo.setMonth(today.getMonth() - 1);

   const oneMonthAgoYear = oneMonthAgo.getFullYear();
   const oneMonthAgoMonth = String(oneMonthAgo.getMonth() + 1).padStart(2, "0");
   const oneMonthAgoDay = String(oneMonthAgo.getDate()).padStart(2, "0");

   return [`${year}-${month}-${day}`, `${oneMonthAgoYear}-${oneMonthAgoMonth}-${oneMonthAgoDay}`];
};

export const dates = getFormattedDate();

export const dateConverter = (date) => {
   const dateToConvert = new Date(date);
   const options = { year: "numeric", month: "long", day: "numeric" };
   const formattedDate = new Intl.DateTimeFormat("en-US", options).format(dateToConvert);
   return formattedDate;
};

export const episodeRuntime = (runtime) => {
   if (runtime === null) return "";

   const hour = Math.floor(runtime / 60);
   const minute = runtime % 60;
   const formattedRuntime = `${hour}h ${minute}m`;
   return formattedRuntime;
};
