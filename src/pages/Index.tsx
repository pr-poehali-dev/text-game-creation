import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  genre: string;
}

interface Message {
  id: string;
  sender: 'user' | 'character';
  text: string;
  characterName?: string;
}

export default function Index() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const [newWorld, setNewWorld] = useState({ name: '', description: '', genre: '' });
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '', personality: '' });

  const createWorld = () => {
    if (newWorld.name && newWorld.description) {
      const world: World = {
        id: Date.now().toString(),
        ...newWorld
      };
      setWorlds([...worlds, world]);
      setNewWorld({ name: '', description: '', genre: '' });
    }
  };

  const createCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const character: Character = {
        id: Date.now().toString(),
        ...newCharacter,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newCharacter.name}`
      };
      setCharacters([...characters, character]);
      setNewCharacter({ name: '', description: '', personality: '' });
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !selectedCharacter) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentMessage
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'character',
        characterName: selectedCharacter.name,
        text: generateResponse(currentMessage, selectedCharacter)
      };
      setMessages(prev => [...prev, characterResponse]);
    }, 1000);

    setCurrentMessage('');
  };

  const generateResponse = (userMessage: string, character: Character) => {
    const responses = [
      `Интересно! Расскажи мне больше об этом.`,
      `Я ${character.personality}. Что ты думаешь об этом?`,
      `Понимаю тебя. ${character.description}`,
      `Это напоминает мне о том времени, когда...`,
      `Хм, давай подумаем об этом вместе.`,
      `А что если мы попробуем по-другому?`,
      `Мне нравится твой подход к этому!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Story Forge
          </h1>
          <p className="text-xl text-purple-200">Создай свою историю, персонажей и мир</p>
        </header>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-purple-800/50">
            <TabsTrigger value="chat">
              <Icon name="MessageCircle" className="mr-2" size={18} />
              Чат
            </TabsTrigger>
            <TabsTrigger value="characters">
              <Icon name="Users" className="mr-2" size={18} />
              Персонажи
            </TabsTrigger>
            <TabsTrigger value="worlds">
              <Icon name="Globe" className="mr-2" size={18} />
              Миры
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="md:col-span-1 bg-purple-800/30 border-purple-600">
                <CardHeader>
                  <CardTitle className="text-white">Персонажи</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {characters.length === 0 ? (
                      <p className="text-purple-300 text-sm">Создайте персонажей во вкладке "Персонажи"</p>
                    ) : (
                      <div className="space-y-2">
                        {characters.map(char => (
                          <Button
                            key={char.id}
                            variant={selectedCharacter?.id === char.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setSelectedCharacter(char)}
                          >
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage src={char.avatar} />
                              <AvatarFallback>{char.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{char.name}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="md:col-span-3 bg-purple-800/30 border-purple-600">
                <CardHeader>
                  <CardTitle className="text-white">
                    {selectedCharacter ? `Чат с ${selectedCharacter.name}` : 'Выберите персонажа'}
                  </CardTitle>
                  {selectedCharacter && (
                    <CardDescription className="text-purple-200">
                      {selectedCharacter.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] mb-4 p-4 bg-purple-900/30 rounded-lg">
                    {messages.length === 0 ? (
                      <div className="text-center text-purple-300 py-8">
                        <Icon name="MessagesSquare" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Начните разговор с персонажем!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                msg.sender === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-purple-700 text-white'
                              }`}
                            >
                              {msg.sender === 'character' && (
                                <p className="font-semibold text-sm mb-1">{msg.characterName}</p>
                              )}
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {selectedCharacter && (
                    <div className="flex gap-2">
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage} className="bg-gradient-to-r from-pink-600 to-purple-600">
                        <Icon name="Send" size={18} />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="characters" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-purple-800/30 border-purple-600">
                <CardHeader>
                  <CardTitle className="text-white">Создать персонажа</CardTitle>
                  <CardDescription className="text-purple-200">
                    Придумайте уникального персонажа для своей истории
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="char-name" className="text-white">Имя</Label>
                    <Input
                      id="char-name"
                      value={newCharacter.name}
                      onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      placeholder="Введите имя персонажа"
                      className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="char-desc" className="text-white">Описание</Label>
                    <Textarea
                      id="char-desc"
                      value={newCharacter.description}
                      onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                      placeholder="Опишите внешность и историю персонажа"
                      className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="char-personality" className="text-white">Характер</Label>
                    <Input
                      id="char-personality"
                      value={newCharacter.personality}
                      onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                      placeholder="Храбрый, умный, веселый..."
                      className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <Button onClick={createCharacter} className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                    <Icon name="Plus" className="mr-2" size={18} />
                    Создать персонажа
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-purple-800/30 border-purple-600">
                <CardHeader>
                  <CardTitle className="text-white">Мои персонажи ({characters.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {characters.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="UserPlus" size={64} className="mx-auto mb-4 text-purple-400 opacity-50" />
                        <p className="text-purple-300">Пока нет персонажей</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {characters.map(char => (
                          <Card key={char.id} className="bg-purple-900/50 border-purple-700">
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={char.avatar} />
                                  <AvatarFallback>{char.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-white text-lg">{char.name}</CardTitle>
                                  <CardDescription className="text-purple-300 text-sm">
                                    {char.personality}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-purple-200 text-sm">{char.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="worlds" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-purple-800/30 border-purple-600">
                <CardHeader>
                  <CardTitle className="text-white">Создать мир</CardTitle>
                  <CardDescription className="text-purple-200">
                    Создайте уникальный мир для вашей истории
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="world-name" className="text-white">Название мира</Label>
                    <Input
                      id="world-name"
                      value={newWorld.name}
                      onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })}
                      placeholder="Название вашего мира"
                      className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="world-genre" className="text-white">Жанр</Label>
                    <Input
                      id="world-genre"
                      value={newWorld.genre}
                      onChange={(e) => setNewWorld({ ...newWorld, genre: e.target.value })}
                      placeholder="Фэнтези, Sci-Fi, Пост-апокалипсис..."
                      className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="world-desc" className="text-white">Описание</Label>
                    <Textarea
                      id="world-desc"
                      value={newWorld.description}
                      onChange={(e) => setNewWorld({ ...newWorld, description: e.target.value })}
                      placeholder="Опишите ваш мир: какие события там происходят, какая атмосфера, кто населяет этот мир..."
                      className="bg-purple-900/50 border-purple-600 text-white placeholder:text-purple-300 min-h-[120px]"
                    />
                  </div>
                  <Button onClick={createWorld} className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                    <Icon name="Globe" className="mr-2" size={18} />
                    Создать мир
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-purple-800/30 border-purple-600">
                <CardHeader>
                  <CardTitle className="text-white">Мои миры ({worlds.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {worlds.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="Sparkles" size={64} className="mx-auto mb-4 text-purple-400 opacity-50" />
                        <p className="text-purple-300">Создайте свой первый мир</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {worlds.map(world => (
                          <Card key={world.id} className="bg-purple-900/50 border-purple-700">
                            <CardHeader>
                              <CardTitle className="text-white flex items-center gap-2">
                                <Icon name="Globe" size={20} className="text-purple-400" />
                                {world.name}
                              </CardTitle>
                              {world.genre && (
                                <CardDescription className="text-purple-300">
                                  {world.genre}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent>
                              <p className="text-purple-200 text-sm">{world.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
