// 팝업 필터 규칙 모음 (필터 시트 선택 규칙, 선택된 칩 목록)
// - 필터 값은 서버 필터 선택지(GET /api/popups/filters)의 value를 그대로 사용
//   진행 상태: UPCOMING 등 / 지역: YONGSAN 등 / 카테고리: categoryId(숫자)
// - 그룹 안에서는 여러 개 선택 (OR), 그룹끼리는 AND (거르기는 서버가 함)
// - 전국 선택 시: 나머지 지역 해제 + 비활성
// - 서울 전체 선택 시: 서울 세부 지역 해제 + 비활성, 서울 외 지역은 함께 선택 가능

export const REGION_ALL = "NATIONWIDE";
export const REGION_SEOUL_ALL = "SEOUL_ALL";

export const EMPTY_FILTERS = { status: [], region: [], category: [] };

// 서울 세부 지역 (서버가 지역 구분을 주지 않아서 프론트에서 정함)
const SEOUL_DETAIL_REGIONS = [
  "GANGNAM_SEOCHO",
  "HONGDAE_SINCHON",
  "JONGNO_GWANGHWAMUN",
  "SEONGSU",
  "YONGSAN",
  "YEOUIDO",
  "JAMSIL",
];

const isSeoulDetailRegion = (region) => SEOUL_DETAIL_REGIONS.includes(region);

// 칩 하나를 눌렀을 때 다음 선택 목록
export const toggleFilterValue = (filters, groupKey, value) => {
  const current = filters[groupKey];
  let next;

  if (current.includes(value)) {
    next = current.filter((item) => item !== value);
  } else if (groupKey === "region" && value === REGION_ALL) {
    next = [REGION_ALL];
  } else if (groupKey === "region" && value === REGION_SEOUL_ALL) {
    next = [...current.filter((item) => !isSeoulDetailRegion(item)), value];
  } else {
    next = [...current, value];
  }

  return { ...filters, [groupKey]: next };
};

// 지역 칩 비활성 여부
export const isRegionDisabled = (selectedRegions, region) => {
  if (selectedRegions.includes(REGION_ALL)) return region !== REGION_ALL;
  if (selectedRegions.includes(REGION_SEOUL_ALL)) {
    return isSeoulDetailRegion(region);
  }
  return false;
};

// 목록 위에 표시할 선택된 필터 칩 (그룹 순서대로, 라벨은 서버 필터 선택지에서 찾음)
export const getSelectedChips = (filters, filterGroups = []) =>
  filterGroups.flatMap((group) =>
    group.options
      .filter((option) => filters[group.key].includes(option.value))
      .map((option) => ({
        groupKey: group.key,
        value: option.value,
        label: option.label,
      })),
  );
