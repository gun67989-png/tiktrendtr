/**
 * Test modu ve fallback icin mock data
 * Gercek TikTok verisine benzer formatta
 */

const MOCK_USERNAMES = [
  'danceking_tr', 'komedyen_ali', 'muzik_elif', 'gamer_burak', 'asci_fatma',
  'moda_selin', 'fitness_can', 'travel_yusuf', 'tech_murat', 'beauty_zeynep',
  'komik_videos', 'trending_tr', 'viral_queen', 'tiktokstar_tr', 'funnymoments',
];

const MOCK_DESCRIPTIONS = [
  'Bu trendi kacirmayin! #fyp #trending #viral',
  'Komedi alti isteyen var mi #komedi #eglence #fyp',
  'Yeni dans challenge #dans #challenge #kesfet',
  'Evde yapilabilecek tarifler #yemek #tarif #kesfet',
  'Gunluk motivasyon #motivasyon #basari #fyp',
  'Oyun dunyanin en iyisi #gaming #oyun #trend',
  'Makyaj donusumu #makyaj #beauty #viral',
  'Seyahat vlog Turkiye #seyahat #turkiye #gezi',
  'Fitness rutinim #fitness #saglik #spor',
  'Teknoloji inceleme #teknoloji #review #trend',
];

const MOCK_COMMENTS = [
  { text: 'Harika video!', sentiment: 'positive' },
  { text: 'Cok guzel olmus', sentiment: 'positive' },
  { text: 'Bunu ben de deneyecegim', sentiment: 'positive' },
  { text: 'Muhtesem dans', sentiment: 'positive' },
  { text: 'Idare eder', sentiment: 'neutral' },
  { text: 'Bu ne ya', sentiment: 'negative' },
  { text: 'Adsafasfa', sentiment: 'neutral' },
  { text: 'Takip takip', sentiment: 'neutral' },
  { text: 'Like atan herkes zengin olacak', sentiment: 'neutral' },
  { text: 'Sonuna kadar izledim bravo', sentiment: 'positive' },
  { text: 'Begendim paylasin', sentiment: 'positive' },
  { text: 'Super icerik devam et', sentiment: 'positive' },
  { text: 'Daha iyisini bekliyor', sentiment: 'neutral' },
  { text: 'Efsane', sentiment: 'positive' },
  { text: 'LOL', sentiment: 'positive' },
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMockVideo(index, hashtag = 'fyp') {
  const username = MOCK_USERNAMES[index % MOCK_USERNAMES.length];
  const desc = MOCK_DESCRIPTIONS[index % MOCK_DESCRIPTIONS.length];
  const videoId = String(7000000000000000000n + BigInt(index) * 1000000n + BigInt(randomBetween(1, 999999)));
  const views = randomBetween(100000, 15000000);
  const likeRatio = (3 + Math.random() * 15) / 100;
  const likes = Math.floor(views * likeRatio);

  // Yorum uret
  const commentCount = randomBetween(5, 15);
  const comments = [];
  for (let i = 0; i < commentCount; i++) {
    const mockComment = MOCK_COMMENTS[randomBetween(0, MOCK_COMMENTS.length - 1)];
    comments.push({
      username: MOCK_USERNAMES[randomBetween(0, MOCK_USERNAMES.length - 1)],
      text: mockComment.text,
      likes: randomBetween(0, 500),
      createdAt: Date.now() - randomBetween(0, 7 * 24 * 60 * 60 * 1000),
    });
  }

  return {
    id: videoId,
    url: `https://www.tiktok.com/@${username}/video/${videoId}`,
    thumbnail: `https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/mock_${videoId}~tplv.jpeg`,
    description: desc,
    author: {
      username,
      displayName: username.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      followers: randomBetween(1000, 5000000),
      avatar: '',
    },
    stats: {
      likes,
      views,
      comments: comments.length + randomBetween(100, 5000),
      shares: randomBetween(50, views * 0.01),
    },
    hashtags: [hashtag, ...desc.match(/#(\w+)/g)?.map(t => t.replace('#', '')) || []],
    createdAt: Date.now() - randomBetween(0, 3 * 24 * 60 * 60 * 1000),
    comments,
  };
}

function getMockData(hashtags = ['fyp', 'trending'], targetUsername = 'test_user') {
  const videos = [];

  // Her hashtag icin 5-8 video
  for (const tag of hashtags) {
    const count = randomBetween(5, 8);
    for (let i = 0; i < count; i++) {
      videos.push(generateMockVideo(videos.length, tag));
    }
  }

  // Kullanici videolari
  const userVideos = [];
  for (let i = 0; i < 10; i++) {
    const video = generateMockVideo(100 + i);
    video.author.username = targetUsername;
    video.author.displayName = targetUsername;
    video.url = `https://www.tiktok.com/@${targetUsername}/video/${video.id}`;
    userVideos.push(video);
  }

  console.log(`[MockData] ${videos.length} trend video + ${userVideos.length} kullanici videosu uretildi`);

  return {
    videos,
    userVideos,
    fetchedAt: Date.now(),
    source: 'mock',
  };
}

module.exports = {
  getMockData,
  generateMockVideo,
};
