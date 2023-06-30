import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Mathf, Random, Sprite } from 'UnityEngine';
import { RoundedRectangle, RoundedRectangleButton, ZepetoText } from 'ZEPETO.World.Gui';
import GameManager from './GameManager';

export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager; // Singleton instance variable

    public rockSprite: Sprite;
    public paperSprite: Sprite;
    public scissorsSprite: Sprite;


    @Header( "Counter" )
    public counterObj: GameObject;
    public counterText: ZepetoText;

    @Header( "Panels" )
    @SerializeField() startPanel: GameObject;
    @SerializeField() gamePanel: GameObject;
    @SerializeField() endPanel: GameObject;

    @Header( "Game" )
    @SerializeField() playerIcon: RoundedRectangle; // Image references of the Player
    @SerializeField() opponentIcon: RoundedRectangle; // Image references of the opponent

    @Header( "End screen" )
    @SerializeField() winnerText: ZepetoText;
    @SerializeField() winsAmount: ZepetoText;
    @SerializeField() losesAmount: ZepetoText;

    @Header( "Buttons" )
    public playBtn: RoundedRectangleButton;
    public rockBtn: RoundedRectangleButton; // Reference to the rock button
    public paperBtn: RoundedRectangleButton; // Reference to the paper button 
    public scissorsBtn: RoundedRectangleButton; // Reference to the scissor button

    private playerWinsAmount: number = 0;
    private playerLosesAmount: number = 0;

    Awake () {
        // Singleton pattern
        if ( UIManager.instance != null ) GameObject.Destroy( this.gameObject );
        else UIManager.instance = this;
    }

    Start () {
        // Call the function to set the logic of the buttons
        this.SetButtonLogic();
    }

    ShowEndPanel ( winner: string, playerWins: bool ) {
        this.gamePanel.SetActive( false );
        this.endPanel.SetActive( true );

        this.winnerText.text = winner;

        if ( playerWins ) this.playerWinsAmount++;
        else this.playerLosesAmount++;

        this.winsAmount.text = this.playerWinsAmount.toString();
        this.losesAmount.text = this.playerLosesAmount.toString();
    }

    ShowDrawEndPanel () {
        this.gamePanel.SetActive( false );
        this.endPanel.SetActive( true );

        this.winnerText.text = "Draw!";
        this.winsAmount.text = this.playerWinsAmount.toString();
        this.losesAmount.text = this.playerLosesAmount.toString();
    }

    // This function set the logic of the buttons off the ui
    SetButtonLogic () {
        // Set the function of the click on the rock button
        this.rockBtn.OnClick.AddListener( () => {
            // Call the function on the GameManager instance to select the hand
            GameManager.instance.SelectPlayerHand( 0 );

            // Call the function on the GameManager instance to select the opponent hand
            GameManager.instance.SelectOpponentHand();
        } );

        // Set the function of the click on the paper button
        this.paperBtn.OnClick.AddListener( () => {
            // Call the function on the GameManager instance to select the hand
            GameManager.instance.SelectPlayerHand( 1 );

            // Call the function on the GameManager instance to select the opponent hand
            GameManager.instance.SelectOpponentHand();
        } );

        // Set the function of the click on the scissors button
        this.scissorsBtn.OnClick.AddListener( () => {
            // Call the function on the GameManager instance to select the hand
            GameManager.instance.SelectPlayerHand( 2 );

            // Call the function on the GameManager instance to select the opponent hand
            GameManager.instance.SelectOpponentHand();
        } );

        this.playBtn.OnClick.AddListener( () => {
            this.StartCoroutine( GameManager.instance.WaitToStart() );
        } );

        this.startPanel.SetActive( false );
        this.gamePanel.SetActive( false );
        this.endPanel.SetActive( false );
    }

    // This functions sets the sprite of the player hand in the selected one
    public SelectPlayerSprite ( selection: number ): void {
        // Set the icon of the opponent on the selection based on the array gameSprites
        // this.playerIcon.Icon = this.gameSprites[ selection ];
        this.playerIcon.Icon = this.SpriteSelection( selection );
        this.playerIcon.IconScale = 1;
    }

    // This functions sets the sprite of the opponent hand in the selected one
    public SelectOpponentSprite ( selection: number ): void {
        // Set the icon of the opponent on the selection based on the array gameSprites
        // this.opponentIcon.Icon = this.gameSprites[ selection ];
        this.opponentIcon.Icon = this.SpriteSelection( selection );
        this.opponentIcon.IconScale = 1;
    }

    public CleanSelections () {
        this.opponentIcon.IconScale = 0;
        this.playerIcon.IconScale = 0;
    }
    SpriteSelection ( selection: number ): Sprite {
        if ( selection == 0 ) return this.rockSprite;
        if ( selection == 1 ) return this.paperSprite;
        if ( selection == 2 ) return this.scissorsSprite;
    }
}