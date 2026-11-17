import { POPUP_FILTER_GROUPS } from "../../data/popupDummyData";

// 팝업 필터 규칙 모음 (필터 시트 선택 규칙, 목록 거르기, 선택된 칩 목록)
// - 그룹 안에서는 여러 개 선택 (OR), 그룹끼리는 AND
// - 전국 선택 시: 나머지 지역 해제 + 비활성
// - 서울 전체 선택 시: 서울 세부 지역(scope: seoul) 해제 + 비활성, 서울 외 지역은 함께 선택 가능

export const REGION_ALL = "전국";
export const REGION_SEOUL_ALL = "서울 전체";

export const EMPTY_FILTERS = { status: [], region: [], category: [] };

const regionOptions =
  POPUP_FILTER_GROUPS.find((group) => group.key === "region")?.options ?? [];

const getRegionScope = (region) =>
  regionOptions.find((option) => option.value === region)?.scope;

// 칩 하나를 눌렀을 때 다음 선택 목록
export const toggleFilterValue = (filters, groupKey, value) => {
  const current = filters[groupKey];
  let next;

  if (current.includes(value)) {
    next = current.filter((item) => item !== value);
  } else if (groupKey === "region" && value === REGION_ALL) {
    next = [REGION_ALL];
  } else if (groupKey === "region" && value === REGION_SEOUL_ALL) {
    next = [
      ...current.filter((item) => getRegionScope(item) !== "seoul"),
      value,
    ];
  } else {
    next = [...current, value];
  }

  return { ...filters, [groupKey]: next };
};

// 지역 칩 비활성 여부
export const isRegionDisabled = (selectedRegions, option) => {
  if (selectedRegions.includes(REGION_ALL)) return option.value !== REGION_ALL;
  if (selectedRegions.includes(REGION_SEOUL_ALL)) {
    return option.scope === "seoul";
  }
  return false;
};

// TODO(API): 서버 필터링으로 교체 (쿼리 형식 확정 필요: 전국=파라미터 생략? 서울 전체=region=seoul?)
export const matchesFilters = (popup, filters) => {
  const { status, region, category } = filters;

  if (status.length > 0 && !status.includes(popup.status)) return false;
  if (category.length > 0 && !category.includes(popup.category)) return false;

  if (region.length > 0 && !region.includes(REGION_ALL)) {
    const isInSeoulAll =
      region.includes(REGION_SEOUL_ALL) &&
      getRegionScope(popup.region) === "seoul";
    if (!isInSeoulAll && !region.includes(popup.region)) return false;
  }

  return true;
};

// 목록 위에 표시할 선택된 필터 칩 (그룹 순서대로)
export const getSelectedChips = (filters) =>
  POPUP_FILTER_GROUPS.flatMap((group) =>
    group.options
      .filter((option) => filters[group.key].includes(option.value))
      .map((option) => ({
        groupKey: group.key,
        value: option.value,
        label: option.label,
      })),
  );
