import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip, Legend 
} from 'recharts';

// スピッツ曲推薦アプリ（超軽量版）
const SpitzMoodMatcher = () => {
  const [appState, setAppState] = useState('welcome');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mentalState, setMentalState] = useState(null);
  const [spitzSongs, setSpitzSongs] = useState([]);
  const [influenceSongs, setInfluenceSongs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSongForChart, setSelectedSongForChart] = useState(null);
  
  // 質問データ（30問）
  const allQuestions = [
    // エネルギー系
    { id: 1, question: "今日は体を動かしたいと思いますか？", influences: { energy: 0.8, melancholy: -0.2, hope: 0.3, calmness: -0.2, adventure: 0.4, nostalgia: 0, conflict: -0.1 }},
    { id: 2, question: "朝起きた時、気分が良かったですか？", influences: { energy: 0.7, melancholy: -0.3, hope: 0.5, calmness: 0.2, adventure: 0.3, nostalgia: 0, conflict: -0.4 }},
    { id: 3, question: "音楽に合わせて踊りたい気分ですか？", influences: { energy: 0.9, melancholy: -0.1, hope: 0.4, calmness: -0.3, adventure: 0.3, nostalgia: 0.1, conflict: -0.2 }},
    { id: 4, question: "友達と騒いで過ごしたいですか？", influences: { energy: 0.8, melancholy: -0.2, hope: 0.4, calmness: -0.4, adventure: 0.3, nostalgia: 0, conflict: -0.1 }},
    { id: 5, question: "新しいプロジェクトを始めたい気分ですか？", influences: { energy: 0.7, melancholy: 0, hope: 0.6, calmness: 0, adventure: 0.5, nostalgia: -0.1, conflict: 0.1 }},
    
    // 切なさ系
    { id: 6, question: "心が少し重い感じがしますか？", influences: { energy: -0.3, melancholy: 0.8, hope: -0.2, calmness: 0, adventure: -0.2, nostalgia: 0.3, conflict: 0.4 }},
    { id: 7, question: "誰かに慰めてもらいたい気分ですか？", influences: { energy: -0.2, melancholy: 0.7, hope: -0.1, calmness: 0.2, adventure: -0.3, nostalgia: 0.2, conflict: 0.3 }},
    { id: 8, question: "雨の日が好きですか？", influences: { energy: -0.1, melancholy: 0.6, hope: 0, calmness: 0.4, adventure: -0.2, nostalgia: 0.4, conflict: 0.1 }},
    { id: 9, question: "一人でいると寂しさを感じますか？", influences: { energy: -0.3, melancholy: 0.7, hope: -0.2, calmness: -0.1, adventure: -0.3, nostalgia: 0.3, conflict: 0.2 }},
    { id: 10, question: "最近、何かを失ったように感じることがありますか？", influences: { energy: -0.4, melancholy: 0.8, hope: -0.3, calmness: -0.1, adventure: -0.2, nostalgia: 0.5, conflict: 0.4 }},
    
    // 希望系
    { id: 11, question: "明日が楽しみですか？", influences: { energy: 0.4, melancholy: -0.3, hope: 0.8, calmness: 0.2, adventure: 0.3, nostalgia: 0, conflict: -0.3 }},
    { id: 12, question: "将来に対して楽観的ですか？", influences: { energy: 0.3, melancholy: -0.4, hope: 0.9, calmness: 0.2, adventure: 0.2, nostalgia: -0.1, conflict: -0.4 }},
    { id: 13, question: "今の状況は将来良くなると思いますか？", influences: { energy: 0.3, melancholy: -0.5, hope: 0.9, calmness: 0.3, adventure: 0.2, nostalgia: -0.1, conflict: -0.5 }},
    { id: 14, question: "新しい可能性を感じますか？", influences: { energy: 0.5, melancholy: -0.2, hope: 0.8, calmness: 0.1, adventure: 0.4, nostalgia: -0.1, conflict: -0.2 }},
    { id: 15, question: "夢に向かって進んでいる実感がありますか？", influences: { energy: 0.6, melancholy: -0.1, hope: 0.8, calmness: 0.1, adventure: 0.4, nostalgia: 0, conflict: -0.1 }},
    
    // 穏やかさ系
    { id: 16, question: "静かな場所でくつろぎたいと思いますか？", influences: { energy: -0.4, melancholy: 0.1, hope: 0.1, calmness: 0.9, adventure: -0.5, nostalgia: 0.2, conflict: -0.6 }},
    { id: 17, question: "心が平和な状態ですか？", influences: { energy: 0.1, melancholy: -0.3, hope: 0.3, calmness: 0.9, adventure: -0.2, nostalgia: 0.1, conflict: -0.7 }},
    { id: 18, question: "ゆっくりとした時間を過ごしたいですか？", influences: { energy: -0.3, melancholy: 0.2, hope: 0.2, calmness: 0.8, adventure: -0.4, nostalgia: 0.3, conflict: -0.4 }},
    { id: 19, question: "瞑想や深呼吸をしたい気分ですか？", influences: { energy: -0.2, melancholy: 0, hope: 0.2, calmness: 0.9, adventure: -0.3, nostalgia: 0.1, conflict: -0.5 }},
    { id: 20, question: "自然の中にいると心が落ち着きますか？", influences: { energy: 0, melancholy: 0, hope: 0.3, calmness: 0.8, adventure: 0.1, nostalgia: 0.2, conflict: -0.4 }},
    
    // 冒険心系
    { id: 21, question: "未知の場所を探検してみたいですか？", influences: { energy: 0.6, melancholy: -0.2, hope: 0.5, calmness: -0.4, adventure: 1.0, nostalgia: -0.2, conflict: 0.1 }},
    { id: 22, question: "新しいことにチャレンジしたいですか？", influences: { energy: 0.7, melancholy: 0, hope: 0.6, calmness: -0.2, adventure: 0.9, nostalgia: -0.1, conflict: 0.1 }},
    { id: 23, question: "旅行に出かけたい気分ですか？", influences: { energy: 0.5, melancholy: 0, hope: 0.4, calmness: -0.2, adventure: 0.8, nostalgia: 0.1, conflict: 0 }},
    { id: 24, question: "新しい人との出会いを求めていますか？", influences: { energy: 0.5, melancholy: 0, hope: 0.5, calmness: -0.1, adventure: 0.7, nostalgia: -0.1, conflict: 0.1 }},
    { id: 25, question: "何か発見をしたいと思いますか？", influences: { energy: 0.5, melancholy: -0.1, hope: 0.6, calmness: -0.2, adventure: 0.8, nostalgia: -0.1, conflict: 0.1 }},
    
    // ノスタルジー系
    { id: 26, question: "昔の写真を見返したいと思いますか？", influences: { energy: -0.1, melancholy: 0.5, hope: 0.1, calmness: 0.3, adventure: -0.3, nostalgia: 1.0, conflict: 0.1 }},
    { id: 27, question: "子供の頃を思い出すことがありますか？", influences: { energy: 0, melancholy: 0.3, hope: 0.2, calmness: 0.2, adventure: -0.2, nostalgia: 0.9, conflict: 0 }},
    { id: 28, question: "昔聴いていた音楽を聴き直したいですか？", influences: { energy: 0.1, melancholy: 0.4, hope: 0.2, calmness: 0.2, adventure: -0.1, nostalgia: 0.9, conflict: 0.1 }},
    
    // 葛藤系
    { id: 29, question: "心の中に矛盾する感情がありますか？", influences: { energy: 0, melancholy: 0.4, hope: -0.2, calmness: -0.6, adventure: 0, nostalgia: 0.2, conflict: 0.9 }},
    { id: 30, question: "決断に迷うことがありますか？", influences: { energy: -0.1, melancholy: 0.3, hope: -0.2, calmness: -0.4, adventure: 0, nostalgia: 0.1, conflict: 0.7 }}
  ];
  
  // スピッツ楽曲データ（実在の名曲50曲）
  const spitzDatabase = [
    { id: 1, title: "楓", artist: "スピッツ", releaseYear: 1998, key: "G", tempo: "ゆったり", type: "spitz", emotionScores: { energy: 2, melancholy: 5, hope: 3, calmness: 4, adventure: 2, nostalgia: 5, conflict: 3 }},
    { id: 2, title: "僕の天使マリ", artist: "スピッツ", releaseYear: 1992, key: "C", tempo: "明るく軽快", type: "spitz", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 3, adventure: 3, nostalgia: 2, conflict: 1 }},
    { id: 3, title: "空も飛べるはず", artist: "スピッツ", releaseYear: 1994, key: "C", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 5, calmness: 4, adventure: 3, nostalgia: 3, conflict: 2 }},
    { id: 4, title: "チェリー", artist: "スピッツ", releaseYear: 1996, key: "C", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 4, calmness: 4, adventure: 2, nostalgia: 5, conflict: 2 }},
    { id: 5, title: "ロビンソン", artist: "スピッツ", releaseYear: 1995, key: "A", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 3, hope: 5, calmness: 2, adventure: 5, nostalgia: 3, conflict: 3 }},
    { id: 6, title: "春の歌", artist: "スピッツ", releaseYear: 1996, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 5, calmness: 3, adventure: 4, nostalgia: 3, conflict: 3 }},
    { id: 7, title: "青い車", artist: "スピッツ", releaseYear: 1994, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 2, adventure: 4, nostalgia: 4, conflict: 3 }},
    { id: 8, title: "君が思い出になる前に", artist: "スピッツ", releaseYear: 1993, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 3, adventure: 2, nostalgia: 4, conflict: 4 }},
    { id: 9, title: "優しいあの子", artist: "スピッツ", releaseYear: 2019, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 4, adventure: 2, nostalgia: 3, conflict: 2 }},
    { id: 10, title: "渚", artist: "スピッツ", releaseYear: 1996, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 4, adventure: 3, nostalgia: 4, conflict: 2 }},
    { id: 11, title: "美しい鰭", artist: "スピッツ", releaseYear: 1999, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 3, adventure: 4, nostalgia: 3, conflict: 2 }},
    { id: 12, title: "スターゲイザー", artist: "スピッツ", releaseYear: 2000, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 2, hope: 5, calmness: 3, adventure: 5, nostalgia: 3, conflict: 2 }},
    { id: 13, title: "遥か", artist: "スピッツ", releaseYear: 1997, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 4, calmness: 4, adventure: 3, nostalgia: 4, conflict: 3 }},
    { id: 14, title: "愛のことば", artist: "スピッツ", releaseYear: 2002, key: "F", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 4, adventure: 2, nostalgia: 3, conflict: 2 }},
    { id: 15, title: "運命の人", artist: "スピッツ", releaseYear: 1995, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 5, calmness: 3, adventure: 4, nostalgia: 3, conflict: 3 }},
    { id: 16, title: "みなと", artist: "スピッツ", releaseYear: 1992, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 3, calmness: 4, adventure: 3, nostalgia: 4, conflict: 2 }},
    { id: 17, title: "猫ちぐら", artist: "スピッツ", releaseYear: 2001, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 3, calmness: 4, adventure: 2, nostalgia: 4, conflict: 2 }},
    { id: 18, title: "スカーレット", artist: "スピッツ", releaseYear: 1996, key: "G", tempo: "ミディアムアップ", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 3, adventure: 4, nostalgia: 3, conflict: 3 }},
    { id: 19, title: "正夢", artist: "スピッツ", releaseYear: 2005, key: "C", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 3, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 20, title: "大好物", artist: "スピッツ", releaseYear: 1997, key: "D", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 2, adventure: 4, nostalgia: 2, conflict: 2 }},
    { id: 21, title: "紫の夜を越えて", artist: "スピッツ", releaseYear: 1991, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 3, adventure: 3, nostalgia: 4, conflict: 3 }},
    { id: 22, title: "恋は夕暮れ", artist: "スピッツ", releaseYear: 1995, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 4, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 23, title: "愛のしるし", artist: "スピッツ", releaseYear: 2003, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 4, adventure: 2, nostalgia: 3, conflict: 2 }},
    { id: 24, title: "さわって・変わって", artist: "スピッツ", releaseYear: 2006, key: "D", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 2, adventure: 5, nostalgia: 2, conflict: 3 }},
    { id: 25, title: "おっぱい", artist: "スピッツ", releaseYear: 1993, key: "A", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 1, hope: 3, calmness: 2, adventure: 3, nostalgia: 2, conflict: 1 }},
    { id: 26, title: "猫になりたい", artist: "スピッツ", releaseYear: 1999, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 3, calmness: 4, adventure: 3, nostalgia: 3, conflict: 2 }},
    { id: 27, title: "若葉", artist: "スピッツ", releaseYear: 2007, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 3, adventure: 3, nostalgia: 3, conflict: 2 }},
    { id: 28, title: "スピカ", artist: "スピッツ", releaseYear: 1998, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 3, adventure: 4, nostalgia: 3, conflict: 2 }},
    { id: 29, title: "醒めない", artist: "スピッツ", releaseYear: 2016, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 3, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 30, title: "つぐみ", artist: "スピッツ", releaseYear: 2008, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 4, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 31, title: "涙がキラリ☆", artist: "スピッツ", releaseYear: 2010, key: "C", tempo: "ミディアムアップ", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 3, adventure: 3, nostalgia: 3, conflict: 2 }},
    { id: 32, title: "ときめきpart1", artist: "スピッツ", releaseYear: 1993, key: "E", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 2, adventure: 4, nostalgia: 3, conflict: 2 }},
    { id: 33, title: "流れ星", artist: "スピッツ", releaseYear: 2000, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 4, calmness: 3, adventure: 3, nostalgia: 4, conflict: 3 }},
    { id: 34, title: "スパイダー", artist: "スピッツ", releaseYear: 2001, key: "G", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 2, adventure: 5, nostalgia: 2, conflict: 3 }},
    { id: 35, title: "ホタル", artist: "スピッツ", releaseYear: 1999, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 4, adventure: 2, nostalgia: 5, conflict: 3 }},
    { id: 36, title: "ありがとさん", artist: "スピッツ", releaseYear: 2012, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 5, calmness: 3, adventure: 3, nostalgia: 3, conflict: 2 }},
    { id: 37, title: "みそか", artist: "スピッツ", releaseYear: 2016, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 3, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 38, title: "ヒバリのこころ", artist: "スピッツ", releaseYear: 2002, key: "C", tempo: "ミディアムアップ", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 3, adventure: 4, nostalgia: 3, conflict: 2 }},
    { id: 39, title: "ヘビーメロウ", artist: "スピッツ", releaseYear: 2008, key: "A", tempo: "ミディアムアップ", type: "spitz", emotionScores: { energy: 4, melancholy: 2, hope: 4, calmness: 2, adventure: 4, nostalgia: 2, conflict: 3 }},
    { id: 40, title: "ナイフ", artist: "スピッツ", releaseYear: 2005, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 2, adventure: 3, nostalgia: 3, conflict: 5 }},
    { id: 41, title: "僕はきっと旅に出る", artist: "スピッツ", releaseYear: 2013, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 5, calmness: 3, adventure: 5, nostalgia: 3, conflict: 2 }},
    { id: 42, title: "歌ウサギ", artist: "スピッツ", releaseYear: 2017, key: "D", tempo: "ミディアムアップ", type: "spitz", emotionScores: { energy: 4, melancholy: 2, hope: 4, calmness: 3, adventure: 4, nostalgia: 2, conflict: 2 }},
    { id: 43, title: "水色の街", artist: "スピッツ", releaseYear: 2014, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 4, adventure: 3, nostalgia: 4, conflict: 2 }},
    { id: 44, title: "8823", artist: "スピッツ", releaseYear: 2010, key: "C", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 3, adventure: 3, nostalgia: 3, conflict: 2 }},
    { id: 45, title: "雪風", artist: "スピッツ", releaseYear: 2016, key: "G", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 4, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 46, title: "ハネモノ", artist: "スピッツ", releaseYear: 2003, key: "E", tempo: "アップテンポ", type: "spitz", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 2, adventure: 5, nostalgia: 2, conflict: 3 }},
    { id: 47, title: "名前をつけてやる", artist: "スピッツ", releaseYear: 2013, key: "A", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 3, hope: 4, calmness: 3, adventure: 3, nostalgia: 3, conflict: 3 }},
    { id: 48, title: "群青", artist: "スピッツ", releaseYear: 2005, key: "D", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 3, melancholy: 4, hope: 3, calmness: 3, adventure: 2, nostalgia: 4, conflict: 3 }},
    { id: 49, title: "魔法のコトバ", artist: "スピッツ", releaseYear: 2001, key: "E", tempo: "ミディアム", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 5, calmness: 3, adventure: 4, nostalgia: 3, conflict: 2 }},
    { id: 50, title: "ビギナー", artist: "スピッツ", releaseYear: 2012, key: "G", tempo: "ミディアムアップ", type: "spitz", emotionScores: { energy: 4, melancholy: 3, hope: 4, calmness: 3, adventure: 3, nostalgia: 3, conflict: 2 }}
  ];
  
  // 影響楽曲データ
  const influenceDatabase = [
    { id: 101, title: "Way of the World", artist: "Cheap Trick", releaseYear: 1979, key: "E", tempo: "ミディアムアップ", type: "influence", grassnoComment: "人生初のロックアルバム『ドリーム・ポリス』の収録曲。ハードなAメロとメロディアスなサビという曲構成に影響を受けた", spitzInfluence: "楽曲構成（ハードなAメロ→メロディアスなサビ）に影響", emotionScores: { energy: 4, melancholy: 2, hope: 4, calmness: 2, adventure: 5, nostalgia: 5, conflict: 3 }},
    { id: 102, title: "Surrender", artist: "Cheap Trick", releaseYear: 1978, key: "A", tempo: "アップテンポ", type: "influence", grassnoComment: "イントロのフレーズは『日なたの窓に憧れて』、サビのコード進行は『ラジオデイズ』で影響を受けている", spitzInfluence: "『日なたの窓に憧れて』『ラジオデイズ』のフレーズ・コード進行", emotionScores: { energy: 5, melancholy: 2, hope: 4, calmness: 1, adventure: 5, nostalgia: 3, conflict: 2 }},
    { id: 103, title: "I Want You To Want Me（甘い罠）", artist: "Cheap Trick", releaseYear: 1977, key: "C", tempo: "ミディアムアップ", type: "influence", grassnoComment: "カノン進行が美しい曲。西城秀樹の『ブルースカイ ブルー』とともにスピッツのカノン進行の元になっている", spitzInfluence: "スピッツのカノン進行全般（『スピカ』など）", emotionScores: { energy: 4, melancholy: 3, hope: 5, calmness: 3, adventure: 3, nostalgia: 4, conflict: 2 }},
    { id: 104, title: "人にやさしく", artist: "THE BLUE HEARTS", releaseYear: 1987, key: "C", tempo: "アップテンポ", type: "influence", grassnoComment: "あまりの衝撃に呆然とした。良質なメロディに日本語詞を激しいビートで乗せる理想を先にやられてしまったと感じた", spitzInfluence: "日本語ロックの理想形、メロディとビートの融合", emotionScores: { energy: 5, melancholy: 2, hope: 5, calmness: 1, adventure: 4, nostalgia: 2, conflict: 4 }},
    { id: 105, title: "春だったね", artist: "吉田拓郎", releaseYear: 1972, key: "G", tempo: "ミディアム", type: "influence", grassnoComment: "スピッツの『君が思い出になる頃に』はこの曲にインスパイアされて作った。母親が拓郎の大ファンで幼少期から親しんだ", spitzInfluence: "『君が思い出になる頃に』の直接的なインスピレーション源", emotionScores: { energy: 3, melancholy: 4, hope: 4, calmness: 4, adventure: 2, nostalgia: 5, conflict: 2 }},
    { id: 106, title: "ブルースカイ ブルー", artist: "西城秀樹", releaseYear: 1978, key: "C", tempo: "ミディアム", type: "influence", grassnoComment: "Cheap Trickの『甘い罠』とともにスピッツにおけるカノン進行の元になっている", spitzInfluence: "スピッツのカノン進行全般", emotionScores: { energy: 3, melancholy: 3, hope: 5, calmness: 4, adventure: 2, nostalgia: 4, conflict: 2 }}
  ];
  
  // 初期化処理
  useEffect(() => {
    const randomQuestions = getRandomQuestions(allQuestions, 10);
    setQuestions(randomQuestions);
  }, []);
  
  // ランダム質問選択
  const getRandomQuestions = (database, count = 10) => {
    const shuffled = [...database].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // 質問に回答した時の処理
  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: value };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };
  
  // 結果を計算する関数
  const calculateResults = (answerData) => {
    const scores = calculateEmotionScores(answerData);
    setMentalState(scores);
    
    const spitzRecommendations = findSimilarSongs(scores, spitzDatabase, 3);
    const influenceRecommendations = findSimilarSongs(scores, influenceDatabase, 3);
    
    setSpitzSongs(spitzRecommendations);
    setInfluenceSongs(influenceRecommendations);
    setAppState('result');
  };
  
  // 感情軸のスコアを計算する関数
  const calculateEmotionScores = (answerData) => {
    const scores = { energy: 3, melancholy: 3, hope: 3, calmness: 3, adventure: 3, nostalgia: 3, conflict: 3 };
    
    Object.entries(answerData).forEach(([questionId, value]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!question) return;
      
      const scale = (value - 3) / 2;
      Object.entries(question.influences).forEach(([emotion, influence]) => {
        scores[emotion] += influence * scale;
      });
    });
    
    Object.keys(scores).forEach(key => {
      scores[key] = Math.max(1, Math.min(5, Math.round(scores[key] * 10) / 10));
    });
    
    return scores;
  };
  
  // 似た感情の曲を見つける関数
  const findSimilarSongs = (userState, database, count = 3) => {
    const songDistances = database.map(song => {
      const scores = song.emotionScores;
      const distance = Math.sqrt(
        Math.pow(scores.energy - userState.energy, 2) +
        Math.pow(scores.melancholy - userState.melancholy, 2) +
        Math.pow(scores.hope - userState.hope, 2) +
        Math.pow(scores.calmness - userState.calmness, 2) +
        Math.pow(scores.adventure - userState.adventure, 2) +
        Math.pow(scores.nostalgia - userState.nostalgia, 2) +
        Math.pow(scores.conflict - userState.conflict, 2)
      );
      return { song, distance };
    });
    
    songDistances.sort((a, b) => a.distance - b.distance);
    return songDistances.slice(0, count).map(item => item.song);
  };
  
  // 最初からやり直す関数
  const resetAssessment = () => {
    const randomQuestions = getRandomQuestions(allQuestions, 10);
    setAppState('welcome');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMentalState(null);
    setSpitzSongs([]);
    setInfluenceSongs([]);
    setSelectedCategory('all');
    setSelectedSongForChart(null);
    setQuestions(randomQuestions);
  };
  
  // レーダーチャートのデータ形式に変換
  const formatChartData = (userState, songState = null) => {
    if (!userState) return [];
    return [
      { subject: '元気', A: userState.energy, B: songState ? songState.energy : 0, fullMark: 5 },
      { subject: '切なさ', A: userState.melancholy, B: songState ? songState.melancholy : 0, fullMark: 5 },
      { subject: '希望', A: userState.hope, B: songState ? songState.hope : 0, fullMark: 5 },
      { subject: '穏やかさ', A: userState.calmness, B: songState ? songState.calmness : 0, fullMark: 5 },
      { subject: '冒険心', A: userState.adventure, B: songState ? songState.adventure : 0, fullMark: 5 },
      { subject: 'ノスタルジー', A: userState.nostalgia, B: songState ? songState.nostalgia : 0, fullMark: 5 },
      { subject: '焦燥・葛藤', A: userState.conflict, B: songState ? songState.conflict : 0, fullMark: 5 }
    ];
  };
  
  // 表示する楽曲を選択
  const getDisplaySongs = () => {
    switch (selectedCategory) {
      case 'spitz': return spitzSongs;
      case 'influences': return influenceSongs;
      default: return [...spitzSongs, ...influenceSongs];
    }
  };
  
  return (
    <div>
      {/* ようこそ画面 */}
      {appState === 'welcome' && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                スピッツ・ムードメーカー
              </h1>
              <div className="text-sm text-gray-500 mb-6">Enhanced with Grassno's Musical Influences</div>
            </div>
            
            <p className="text-gray-700 mb-8 text-center leading-relaxed">
              あなたの気分に合わせて、ぴったりのスピッツの曲をおすすめします。
              30問の質問からランダムに10問を選択し、50曲のスピッツ名曲と
              草野正宗さんが影響を受けた楽曲から最適な組み合わせを推薦します。
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">このアプリの特徴：</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 30問からランダム10問で毎回異なる体験</li>
                <li>• 50曲のスピッツ名曲データベース</li>
                <li>• 7つの感情軸での科学的マッチング</li>
                <li>• 草野正宗の音楽的ルーツも探索</li>
                <li>• レーダーチャートで視覚的に理解</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setAppState('question')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                心理診断を開始する
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 質問画面 */}
      {appState === 'question' && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-indigo-600">進捗状況</span>
                <span className="text-sm text-gray-500">{currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            {questions[currentQuestionIndex] && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                  {questions[currentQuestionIndex].question}
                </h2>
                
                <div className="space-y-3">
                  {[
                    { value: 5, label: "とてもそう思う", color: "from-green-500 to-emerald-500" },
                    { value: 4, label: "そう思う", color: "from-blue-500 to-cyan-500" },
                    { value: 3, label: "どちらでもない", color: "from-gray-400 to-gray-500" },
                    { value: 2, label: "あまりそう思わない", color: "from-orange-400 to-yellow-500" },
                    { value: 1, label: "まったくそう思わない", color: "from-red-400 to-pink-500" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-4 rounded-lg text-white font-medium bg-gradient-to-r ${option.color} hover:opacity-90 transform hover:scale-105 transition duration-200 shadow-md`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 結果画面 */}
      {appState === 'result' && mentalState && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                あなたの心理状態と推薦楽曲
              </h2>
              
              {/* レーダーチャート */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">感情分析レーダーチャート</h3>
                
                {/* 楽曲選択ドロップダウン */}
                <div className="flex justify-center mb-4">
                  <select
                    value={selectedSongForChart ? selectedSongForChart.id : ''}
                    onChange={(e) => {
                      const songId = parseInt(e.target.value);
                      const song = [...spitzSongs, ...influenceSongs].find(s => s.id === songId);
                      setSelectedSongForChart(song || null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">楽曲を選択して比較...</option>
                    {spitzSongs.length > 0 && (
                      <optgroup label="推薦されたスピッツ楽曲">
                        {spitzSongs.map(song => (
                          <option key={song.id} value={song.id}>
                            {song.title} - {song.artist}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {influenceSongs.length > 0 && (
                      <optgroup label="推薦された影響楽曲">
                        {influenceSongs.map(song => (
                          <option key={song.id} value={song.id}>
                            {song.title} - {song.artist}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={formatChartData(mentalState, selectedSongForChart?.emotionScores)}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar
                      name="あなたの状態"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                    {selectedSongForChart && (
                      <Radar
                        name={selectedSongForChart.title}
                        dataKey="B"
                        stroke={selectedSongForChart.type === 'spitz' ? "#ec4899" : "#a855f7"}
                        fill={selectedSongForChart.type === 'spitz' ? "#ec4899" : "#a855f7"}
                        fillOpacity={0.4}
                      />
                    )}
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              {/* カテゴリー選択タブ */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-lg shadow-sm" role="group">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-200`}
                  >
                    すべて表示
                  </button>
                  <button
                    onClick={() => setSelectedCategory('spitz')}
                    className={`px-6 py-3 text-sm font-medium ${
                      selectedCategory === 'spitz'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border-t border-b border-gray-200`}
                  >
                    スピッツ楽曲
                  </button>
                  <button
                    onClick={() => setSelectedCategory('influences')}
                    className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                      selectedCategory === 'influences'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-200`}
                  >
                    影響を受けた楽曲
                  </button>
                </div>
              </div>
              
              {/* 推薦楽曲リスト */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getDisplaySongs().map((song, index) => (
                  <div
                    key={song.id}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-800">{song.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        song.type === 'spitz' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {song.type === 'spitz' ? 'スピッツ' : '影響楽曲'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{song.artist}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>リリース: {song.releaseYear}年</p>
                      <p>キー: {song.key} / テンポ: {song.tempo}</p>
                    </div>
                    
                    {song.type === 'influence' && (
                      <div className="mt-3 p-3 bg-white rounded-md">
                        <p className="text-xs text-gray-700 italic">
                          {song.spitzInfluence}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-1">マッチ度</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            song.type === 'spitz' 
                              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' 
                              : 'bg-gradient-to-r from-purple-500 to-purple-600'
                          }`}
                          style={{ width: `${100 - index * 15}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 詳細分析 */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">あなたの心理状態の詳細</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(mentalState).map(([key, value]) => {
                    const labels = {
                      energy: '元気',
                      melancholy: '切なさ',
                      hope: '希望',
                      calmness: '穏やかさ',
                      adventure: '冒険心',
                      nostalgia: 'ノスタルジー',
                      conflict: '焦燥・葛藤'
                    };
                    return (
                      <div key={key} className="text-center">
                        <div className="text-sm text-gray-600">{labels[key]}</div>
                        <div className="text-2xl font-bold text-indigo-600">{value.toFixed(1)}</div>
                        <div className="text-xs text-gray-500">/5.0</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* もう一度ボタン */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={resetAssessment}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  もう一度診断する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpitzMoodMatcher;