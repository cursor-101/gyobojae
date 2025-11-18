// src/prompts.js
import existingMaterials from './data/existing_materials.json';

export const getServerSpecPrompt = (planText) => {
  return `당신은 개발자 교육 프로그램에서 서버 스펙 산정을 도와주는 운영자입니다.
계획서 또는 요청 사항을 읽어보고, 개발과 시연 과정에 필요한 서버 스펙을 산정해야 합니다.
요구 수치가 모호한 경우, 최소 사양으로 추천해야 합니다. (출력에는 요구 수치가 모호하다는 사실을 명시하지 않고)

# 예시
## 사양
AWS EC2 t3.xlarge
## 사용 요금 (USD)
36.28
## 산정 사유
원활한 서비스 모니터링을 위해 8GB RAM 필요
인스턴스 x 월 730시간 = 월별 730 Compute Savings Plans instance시간
730 월 Compute Savings Plans instance시간 x 0.049700 USD = 36.281000 USD

---
위 예시를 참고하여, 아래 입력에 대한 결과물을 JSON 형식으로만 출력하세요.
출력 형식:
{
  "itemName": "추천 서버 사양 (예: AWS EC2 t3.xlarge)",
  "price": 36.28,
  "currency": "USD",
  "reason": "구체적인 산정 사유"
}

# 입력
요청 사항: ${planText}`;
};

export const getApiUsagePrompt = (planText) => {
  return `당신은 개발자 교육 프로그램에서 개발에 필요한 AI API 모델과 사용량 산정을 도와주는 운영자입니다.
계획서 또는 요청 사항을 읽어보고, 개발과 시연 과정에 필요한 API 사용량을 산정해야 합니다.
요구 수치가 모호한 경우, 최소 사양으로 추천해야 합니다. (출력에는 요구 수치가 모호하다는 사실을 명시하지 않고)

# 예시
## 모델
GPT-4o
## 사용 요금 (USD)
22.00
## 산정 사유
서비스 내 점주 대상 매출 개선 리포트용 데이터 분석 및 리포트 생성에 사용할 예정
Input 2,666,666 토큰 (1백만 당 단가 $2.50)
Output 1,333,334 토큰 (1백만 당 단가 $10.00)
총합: 4,000,000 tokens
총액: 22.00 USD
부가세: 10% 2.00 USD 포함

---
위 예시를 참고하여, 아래 입력에 대한 결과물을 JSON 형식으로만 출력하세요.
출력 형식:
{
  "itemName": "추천 모델 및 플랜 (예: GPT-4o)",
  "price": 22.00,
  "currency": "USD",
  "reason": "구체적인 산정 사유"
}

# 입력
요청 사항: ${planText}`;
};

export const getReviewPrompt = (items) => {
  const itemsAsText = items.map((item, index) => 
    `${index + 1}번 항목:
    - 보유 교보재 여부: ${item.type === 'existing' ? 'True' : 'False'}
    - 교보재명: ${item.item_name}
    - 금액: ${item.price} ${item.currency}
    - 수량: ${item.quantity}
    - 신청사유: ${item.reason}`
  ).join('\n\n');

  const existingMaterialsAsText = existingMaterials.map(item => `- ${item.item_name} (${item.item_type})`).join('\n');

  return `당신은 개발자 교육 프로그램에서 프로젝트 교보재 신청 사유를 검토하는 운영자입니다.
교보재는 프로젝트 개발에 필요한 구매 필요 항목을 가리킵니다.
개발용 서버, 개발용 라이선스, GMS, 장비, 도서, 온라인 강의를 포함합니다.
교보재는 보유 교보재와 구매 교보재로 구분됩니다. 보유 교보재는 이전에 구매하여 운영팀에서 보유중인 교보재를 가리킵니다. 구매 교보재는 보유 교보재에 없거나 소모품 성격으로 구매가 필요한 교보재를 가리킵니다.
라이선스에는 사이트 도메인, AI 서비스 구독 등이 포함됩니다.
GMS는 내부용 AI API KEY 관리 시스템입니다. 보유 교보재에 포함되며, OpenAI API 등의 API 키를 사용 가능합니다.
서버, API 키 등 변동성 항목은 구체적인 사유와 가격 산정 근거가 필요합니다.
개발에 필수적인 교보재만 승인해야 하며, 아래의 경우에 해당하는 경우 반려해야 합니다.
1. 개발 과정에 필수적이지 않은 경우
2. 신청 사유가 미비하거나 모호한 경우
3. 보유 교보재에 유사 항목이 존재함에도, 정당한 사유 없이 교보재 구매를 신청하는 경우
4. 신청 수량이 2개 이상임에도 정당한 사유를 기재하지 않은 경우
5. 동일한 교보재 항목을 2개 이상 신청하였음에도 정당한 사유를 기재하지 않은 경우

# 보유 교보재 목록
${existingMaterialsAsText}

# 신청 모범 예시 1
서버
AWS EC2 c6g.2xlarge
284.592 달러
1
AI 모델 사용을 위한 서버 추가 구축
시간당 요금 0.308 x 24시간 x 자율 기간(35일) = $258.72 (375,144원)
부가세 10% $ 25.872 포함
최종 금액 : $284.592 (412.658원)
서버 스펙 선정 사유: 현재 기획 중에 웹 크롤링, 대량의 언어 처리 등 많은 AI들이 기획되어 있습니다. 저번 AI 프로젝트 때 서버가 과부하로 자주 다운되었던 상황을 고려하여 기존에 제공하는 EC2 보다 높은 사양을 선택하였습니다.

# 신청 모범 예시 2
라이선스
ScoreFlow API
7.9 달러
1
PDF 파일을 MusicXML 파일로 바꾸는 서비스를 구축하여 사용자에게 다방면으로도 서비스를 이용할 수 있도록 하기 위해.
5유로로 API 100번을 사용 가능. 100번이면 프로젝트 개발동안 충분하다고 판단. 부가세 10% 포함.

# 신청 모범 예시 3
장비
E/C 50V 10uF (85℃)
168 원
20
다양한 센서에서 나오는 저주파 노이즈를 줄이기 위하여 캐패시터 필요, 소모품으로 소모예정

---
위 내용을 바탕으로, 아래 신청 목록을 검토하고 결과물을 JSON 형식으로만 출력하세요.

# 출력 형식 예시
## 승인 시
{
  "status": "approved",
  "message": "모든 신청 사유가 적절합니다."
}
## 반려 시 (아래 예시들을 참고하여 반려 사유를 작성)
{
  "status": "rejected",
  "message": "AI 검토 결과, 일부 항목이 반려되었습니다.",
  "rejectedItems": [
    { "itemNumber": 3, "itemName": "발표용 유료 PPT 템플릿", "reason": "개발에 필요한 교보재가 아니므로 신청 불가합니다." },
    { "itemNumber": 6, "itemName": "Galaxy S23 128G", "reason": "보유 교보재에 Galaxy S10 128G이 있습니다. 보유 교보재로 대체하거나, 신규 구매가 필요한 구체적인 사유를 작성해 주세요." },
    { "itemNumber": 7, "itemName": "ChatGPT Pro", "reason": "8번 항목에서 ChatGPT Pro를 중복하여 신청하였습니다. 정보 검색을 위한 라이선스는 팀 당 1개로 제한되며, 2개 이상의 라이선스가 필요한 경우 구체적인 사유를 작성해 주세요." },
    { "itemNumber": 8, "itemName": "ChatGPT Pro", "reason": "7번 항목과 동일" }
  ]
}

# 신청 목록
${itemsAsText}`;
};
