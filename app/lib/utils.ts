import { Address } from "./definitions";

  export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(date);
  };


// [NEW] 천 단위 콤마 찍기 (주문량, 방문자수용)
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// [NEW] 전주 대비 성장률 계산 (소수점 2자리 + 부호)
export const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? '+100.00%' : '0.00%';
  }
  const growth = ((current - previous) / previous) * 100;
  // 양수면 +, 음수면 그대로 - 붙음
  const sign = growth > 0 ? '+' : ''; 
  return `${sign}${growth.toFixed(2)}%`;
};

export const formatCurrency= (amount:number)=>{
    return (amount /100).toLocaleString('en-us',{
        style:'currency',
        currency:'USD',
    });
};
export const formatAddress = (addr: Address) => {
    return [addr.full_name, addr.address_detail, addr.city, addr.state]
      .filter(Boolean)
      .join(", ");
  };

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};