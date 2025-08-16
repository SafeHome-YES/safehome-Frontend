export default [
  {
    id: 'cctvCount',
    label: 'CCTV 많은 지역 선호',
    type: 'boolean'
  },
  {
    id: 'streetLight',
    label: '가로등 밝기/개수 중요도',
    type: 'rating',
    min: 1,
    max: 5
  },
  {
    id: 'nearPolice',
    label: '경찰서/치안센터 근접성 중요도',
    type: 'rating',
    min: 1,
    max: 5
  },
  {
    id: 'safePath',
    label: '안심귀갓길 여부',
    type: 'boolean'
  }
];
