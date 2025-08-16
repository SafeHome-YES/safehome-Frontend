export default {
  title: "지역 선호도 설정",
  fields: [
    {
      name: "metroLines",
      label: "선호하는 지하철 호선",
      type: "multiSelect",
      options: ["1호선", "2호선", "3호선", "4호선", "5호선"]
    },
    {
      name: "preferredAreas",
      label: "선호 지역",
      type: "text",
      placeholder: "예: 마포구, 강남구"
    }
  ]
};
