export default [
  {
    id: 'nearSubway',
    label: '지하철과의 거리 중요도',
    type: 'rating', // 1~5 중요도
    min: 1,
    max: 5
  },
  {
    id: 'nearHospital',
    label: '병원/약국 접근성 중요도',
    type: 'rating',
    min: 1,
    max: 5
  },
  {
    id: 'nearConvenience',
    label: '편의점 접근성 중요도',
    type: 'rating',
    min: 1,
    max: 5
  },
  {
    id: 'nearMart',
    label: '대형마트/시장 접근성 중요도',
    type: 'rating',
    min: 1,
    max: 5
  }
];
