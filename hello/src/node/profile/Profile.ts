export class Profile{
  static keyBoard : Profile | null = null;

  static getKeyBoard() : Profile{
    if(Profile.keyBoard == null){
      Profile.keyBoard = new Profile();
    }

    return Profile.keyBoard;
  }
}
