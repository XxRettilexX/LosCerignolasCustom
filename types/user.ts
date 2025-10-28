export interface User {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'utente_registrato' | 'chef' | 'cassa';
  loyalty_points: number;
}
