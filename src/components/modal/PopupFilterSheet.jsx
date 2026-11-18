import { useState } from "react";
import styled from "styled-components";
import BottomSheet from "./BottomSheet";
import CategoryButton from "../button/CategoryButton";
import CommonButton from "../button/CommonButton";

import { POPUP_FILTER_GROUPS } from "../../data/popupDummyData";
import {
  isRegionDisabled,
  toggleFilterValue,
} from "../../pages/popup/popupFilterUtils";

// 팝업 필터 바텀시트 (피그마 필터 바텀시트 293:7545)
// - 열릴 때마다 새로 마운트되어 지금 적용된 필터(appliedFilters)로 시작
// - 칩을 누르면 draft만 바뀌고, "선택 완료"를 눌러야 목록에 반영
// - 딤 배경을 눌러 닫으면 draft는 버림
export default function PopupFilterSheet({ appliedFilters, onApply, onClose }) {
  const [draft, setDraft] = useState(appliedFilters);

  return (
    <BottomSheet isOpen onClose={onClose}>
      <Body>
        <Title>필터</Title>

        <Groups>
          {POPUP_FILTER_GROUPS.map((group) => (
            <Group key={group.key}>
              <GroupTitle>{group.title}</GroupTitle>

              <Chips>
                {group.options.map((option) => (
                  <CategoryButton
                    key={option.value}
                    selected={draft[group.key].includes(option.value)}
                    disabled={
                      group.key === "region" &&
                      isRegionDisabled(draft.region, option)
                    }
                    onChange={() =>
                      setDraft((prev) =>
                        toggleFilterValue(prev, group.key, option.value),
                      )
                    }
                  >
                    {option.label}
                  </CategoryButton>
                ))}
              </Chips>
            </Group>
          ))}
        </Groups>
      </Body>

      <ButtonArea>
        <CommonButton
          $width={354}
          $borderRadius={10000}
          onClick={() => onApply(draft)}
        >
          선택 완료
        </CommonButton>
      </ButtonArea>
    </BottomSheet>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 0 32px;
`;

const Title = styled.h2`
  margin: 0;
  color: #000;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
`;

const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GroupTitle = styled.h3`
  margin: 0;
  color: #000;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`;

// TODO: 피그마는 줄마다 양 끝 정렬로 직접 배치됨. 우선 간격 6px 자동 줄바꿈으로 구현
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

// 피그마: 칩 영역 끝 ~ 버튼 49px, 버튼 아래 32px
const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 49px 24px 32px;
`;
