import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Character {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface GameChoice {
  text: string;
  nextScene: string;
}

interface GameScene {
  id: string;
  text: string;
  choices: GameChoice[];
}

interface GameProgress {
  currentScene: string;
  characters: Character[];
  history: string[];
}

const Index = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '', emoji: '🚀' });
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    currentScene: 'start',
    characters: [],
    history: []
  });

  const gameScenes: Record<string, GameScene> = {
    start: {
      id: 'start',
      text: 'Вы просыпаетесь на космической станции. Системы жизнеобеспечения работают нестабильно. Что будете делать?',
      choices: [
        { text: 'Проверить систему навигации', nextScene: 'navigation' },
        { text: 'Исследовать грузовой отсек', nextScene: 'cargo' },
        { text: 'Связаться с базой', nextScene: 'communication' }
      ]
    },
    navigation: {
      id: 'navigation',
      text: 'Навигационная система показывает странные аномалии в близлежащем секторе. Датчики фиксируют неизвестный объект.',
      choices: [
        { text: 'Приблизиться к объекту', nextScene: 'approach' },
        { text: 'Вернуться к станции', nextScene: 'start' }
      ]
    },
    cargo: {
      id: 'cargo',
      text: 'В грузовом отсеке вы находите контейнер с неизвестной технологией. Он излучает слабое свечение.',
      choices: [
        { text: 'Открыть контейнер', nextScene: 'container' },
        { text: 'Вернуться к станции', nextScene: 'start' }
      ]
    },
    communication: {
      id: 'communication',
      text: 'Связь с базой прерывается помехами. Вы слышите фрагменты сообщения о эвакуации.',
      choices: [
        { text: 'Попытаться усилить сигнал', nextScene: 'signal' },
        { text: 'Вернуться к станции', nextScene: 'start' }
      ]
    },
    approach: {
      id: 'approach',
      text: 'Приближаясь к объекту, вы понимаете, что это древний корабль неизвестной цивилизации...',
      choices: [
        { text: 'Начать заново', nextScene: 'start' }
      ]
    },
    container: {
      id: 'container',
      text: 'Открыв контейнер, вы обнаруживаете голографическую карту звездных систем...',
      choices: [
        { text: 'Начать заново', nextScene: 'start' }
      ]
    },
    signal: {
      id: 'signal',
      text: 'Усилив сигнал, вы получаете координаты спасательной капсулы...',
      choices: [
        { text: 'Начать заново', nextScene: 'start' }
      ]
    }
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
      setGameProgress(JSON.parse(savedProgress));
    }

    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
  }, [gameProgress]);

  useEffect(() => {
    localStorage.setItem('characters', JSON.stringify(characters));
  }, [characters]);

  const handleChoice = (nextScene: string) => {
    const currentSceneData = gameScenes[gameProgress.currentScene];
    setGameProgress({
      ...gameProgress,
      currentScene: nextScene,
      history: [...gameProgress.history, currentSceneData.text]
    });
  };

  const addCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const character: Character = {
        id: Date.now().toString(),
        ...newCharacter
      };
      setCharacters([...characters, character]);
      setNewCharacter({ name: '', description: '', emoji: '🚀' });
    }
  };

  const deleteCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
  };

  const resetGame = () => {
    setGameProgress({
      currentScene: 'start',
      characters: [],
      history: []
    });
  };

  const currentScene = gameScenes[gameProgress.currentScene];

  return (
    <div className="min-h-screen bg-stars">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-glow mb-4 font-futura">
            SCI-FI STORIES
          </h1>
          <p className="text-xl text-scifi-cyan">Создавай свои космические приключения</p>
        </header>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50 backdrop-blur-lg">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Home" className="mr-2" size={18} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="characters" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" className="mr-2" size={18} />
              Персонажи
            </TabsTrigger>
            <TabsTrigger value="game" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Gamepad2" className="mr-2" size={18} />
              Игра
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="User" className="mr-2" size={18} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur-lg border-scifi-cyan/30">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-float">🚀</div>
                    <h2 className="text-3xl font-bold mb-4">Добро пожаловать в мир будущего</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Создавайте уникальных персонажей и проживайте захватывающие космические истории
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50 hover:bg-muted/70 transition-all hover:scale-105">
                      <CardContent className="pt-6 text-center">
                        <Icon name="Users" size={48} className="mx-auto mb-4 text-scifi-cyan" />
                        <h3 className="font-bold text-lg mb-2">Создавай персонажей</h3>
                        <p className="text-sm text-muted-foreground">
                          Разработай уникальных героев для своих историй
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50 hover:bg-muted/70 transition-all hover:scale-105">
                      <CardContent className="pt-6 text-center">
                        <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-scifi-cyan" />
                        <h3 className="font-bold text-lg mb-2">Пиши истории</h3>
                        <p className="text-sm text-muted-foreground">
                          Создавай увлекательные сюжеты и переплетения
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50 hover:bg-muted/70 transition-all hover:scale-105">
                      <CardContent className="pt-6 text-center">
                        <Icon name="Save" size={48} className="mx-auto mb-4 text-scifi-cyan" />
                        <h3 className="font-bold text-lg mb-2">Сохраняй прогресс</h3>
                        <p className="text-sm text-muted-foreground">
                          Все твои достижения надежно хранятся
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => setCurrentTab('game')}
                      size="lg"
                      className="bg-scifi-cyan hover:bg-scifi-cyan/80 text-scifi-navy font-bold animate-glow-pulse"
                    >
                      <Icon name="Play" className="mr-2" size={20} />
                      Начать приключение
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur-lg border-scifi-cyan/30 mb-6">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Icon name="UserPlus" className="mr-2" />
                  Создать персонажа
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Эмодзи</label>
                    <Input
                      placeholder="🚀"
                      value={newCharacter.emoji}
                      onChange={(e) => setNewCharacter({ ...newCharacter, emoji: e.target.value })}
                      className="bg-muted/50 border-scifi-cyan/30 text-2xl text-center max-w-24"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя персонажа</label>
                    <Input
                      placeholder="Капитан Нова"
                      value={newCharacter.name}
                      onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      className="bg-muted/50 border-scifi-cyan/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Описание</label>
                    <Textarea
                      placeholder="Бесстрашный исследователь космоса..."
                      value={newCharacter.description}
                      onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                      className="bg-muted/50 border-scifi-cyan/30 min-h-24"
                    />
                  </div>
                  <Button 
                    onClick={addCharacter}
                    className="w-full bg-scifi-cyan hover:bg-scifi-cyan/80 text-scifi-navy font-bold"
                  >
                    <Icon name="Plus" className="mr-2" />
                    Добавить персонажа
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <Card key={character.id} className="bg-card/80 backdrop-blur-lg border-scifi-cyan/30 hover:scale-105 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className="h-16 w-16 text-3xl bg-scifi-cyan/20">
                        <AvatarFallback>{character.emoji}</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCharacter(character.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{character.name}</h3>
                    <p className="text-sm text-muted-foreground">{character.description}</p>
                  </CardContent>
                </Card>
              ))}

              {characters.length === 0 && (
                <Card className="bg-card/50 backdrop-blur-lg border-dashed border-2 col-span-full">
                  <CardContent className="pt-6 text-center py-12">
                    <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Пока нет персонажей. Создайте первого!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="game" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur-lg border-scifi-cyan/30">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Icon name="Gamepad2" className="mr-2" />
                    Космическое приключение
                  </h2>
                  <Button
                    variant="outline"
                    onClick={resetGame}
                    className="border-scifi-cyan/30 hover:bg-scifi-cyan/10"
                  >
                    <Icon name="RotateCcw" className="mr-2" size={18} />
                    Начать заново
                  </Button>
                </div>

                <div className="space-y-6">
                  <Card className="bg-muted/30 border-scifi-cyan/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">🌌</div>
                        <div className="flex-1">
                          <p className="text-lg leading-relaxed">{currentScene.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {currentScene.choices.map((choice, index) => (
                      <Button
                        key={index}
                        onClick={() => handleChoice(choice.nextScene)}
                        className="w-full justify-start text-left h-auto py-4 px-6 bg-card hover:bg-scifi-cyan/20 border border-scifi-cyan/30 transition-all hover:scale-105"
                        variant="outline"
                      >
                        <Icon name="ChevronRight" className="mr-3 shrink-0" />
                        <span className="text-base">{choice.text}</span>
                      </Button>
                    ))}
                  </div>

                  {gameProgress.history.length > 0 && (
                    <Card className="bg-muted/20 border-scifi-cyan/20">
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-4 flex items-center">
                          <Icon name="History" className="mr-2" />
                          История выборов
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {gameProgress.history.slice(-3).map((text, index) => (
                            <p key={index} className="text-sm text-muted-foreground border-l-2 border-scifi-cyan/50 pl-3">
                              {text}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur-lg border-scifi-cyan/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div>
                    <Avatar className="h-32 w-32 mx-auto mb-4 bg-scifi-cyan/20 text-6xl">
                      <AvatarFallback>👨‍🚀</AvatarFallback>
                    </Avatar>
                    <h2 className="text-3xl font-bold mb-2">Космический исследователь</h2>
                    <Badge variant="secondary" className="bg-scifi-cyan/20 text-scifi-cyan">
                      Активный игрок
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6 text-center">
                        <div className="text-4xl font-bold text-scifi-cyan mb-2">
                          {characters.length}
                        </div>
                        <p className="text-sm text-muted-foreground">Персонажей создано</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="pt-6 text-center">
                        <div className="text-4xl font-bold text-scifi-cyan mb-2">
                          {gameProgress.history.length}
                        </div>
                        <p className="text-sm text-muted-foreground">Решений принято</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="pt-6 text-center">
                        <div className="text-4xl font-bold text-scifi-cyan mb-2">
                          1
                        </div>
                        <p className="text-sm text-muted-foreground">Историй начато</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-muted/20">
                    <CardContent className="pt-6">
                      <h3 className="font-bold mb-4 flex items-center justify-center">
                        <Icon name="Trophy" className="mr-2" />
                        Достижения
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">🌟</span>
                            <div className="text-left">
                              <p className="font-medium">Первый шаг</p>
                              <p className="text-xs text-muted-foreground">Начать первое приключение</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-scifi-cyan/20">Получено</Badge>
                        </div>

                        {characters.length > 0 && (
                          <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">👤</span>
                              <div className="text-left">
                                <p className="font-medium">Создатель</p>
                                <p className="text-xs text-muted-foreground">Создать первого персонажа</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-scifi-cyan/20">Получено</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
