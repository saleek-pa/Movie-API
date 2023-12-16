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

export const dates = getFormattedDate()
