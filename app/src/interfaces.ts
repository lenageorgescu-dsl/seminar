export type numericalData = {
  meili: number;
  typesense: number;
  elastic: number;
};

export type numericalArrayData = {
  meili: number[];
  typesense: number[];
  elastic: number[];
};

export interface StorageStats {
  name: 'Storage';
  init: numericalData;
  index: { articles: numericalData; tweets: numericalData };
}

export interface CpuStats {
  name: 'CPU';
  init: numericalData;
  index: { articles: numericalArrayData; tweets: numericalArrayData };
  search: searchStatsArray;
}

export interface MemStats {
  name: 'Memory';
  init: numericalData;
  tweets: numericalArrayData;
  articles: numericalArrayData;
  search: searchStatsArray;
}

export interface SpeedStats {
  name: 'Speed';
  index: { articles: numericalData; tweets: numericalData };
  search: searchStats;
}

export interface HitStats {
  name: 'Hits';
  search: searchStats;
}

export type searchStatsArray = {
  placeholderSearch: {
    articles: numericalArrayData;
    tweets: numericalArrayData;
  };
  keyWordSearch?: { articles: numericalArrayData; tweets: numericalArrayData };
  boolQuerySearch?: {
    articles: numericalArrayData;
    tweets: numericalArrayData;
  };
};

export type searchStats = {
  placeholderSearch: { articles: numericalData; tweets: numericalData };
  keyWordSearch?: { articles: numericalData; tweets: numericalData };
  boolQuerySearch?: { articles: numericalData; tweets: numericalData };
};
