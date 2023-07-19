import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Color, GameObject, Sprite } from 'UnityEngine';
import { RoundedRectangle, RoundedRectangleButton, ZepetoText } from 'ZEPETO.World.Gui';
import GameManager, { Hands } from './GameManager';

// Enum  with the posible panels to show
export enum UIPanel {
    Start, Game, End, None
}

// This class is responsible for controlling everything related to the UI and its interactions.
export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager; // Singleton instance variable

    public rockSprite: Sprite; // Reference of the sprite of the rock
    public paperSprite: Sprite; // Reference of the sprite of the paper
    public scissorsSprite: Sprite; // Reference of the sprite of the scissors

    @Header( "Counter" )
    public counterObj: GameObject; // Reference to the counter
    public counterText: ZepetoText; // Reference to the text of the counter

    @Header( "Panels" )
    @SerializeField() startPanel: GameObject; // Reference to the start panel
    @SerializeField() gamePanel: GameObject; // Reference to the game panel 
    @SerializeField() endPanel: GameObject; // Reference to the end panel
    @SerializeField() endPanelBg: RoundedRectangle; // Reference to the end panel background

    @Header( "Game" )
    @SerializeField() playerIcon: RoundedRectangle; // Image references of the Player
    @SerializeField() opponentIcon: RoundedRectangle; // Image references of the opponent

    @Header( "End screen" )
    @SerializeField() winnerText: ZepetoText; // Reference to the winner text
    @SerializeField() winsAmount: ZepetoText; // Reference to the text that have the amount of wins of the player
    @SerializeField() losesAmount: ZepetoText; // Reference to the text that have the amount of loses of the player

    @SerializeField() playerWinColor: Color; // Color to change the background of the end panel when the player wins
    @SerializeField() cpuWinColor: Color; // Color to change the background of the end panel when the player loses

    @Header( "Buttons" )
    public playBtn: RoundedRectangleButton; // Reference to the play button
    public rockBtn: RoundedRectangleButton; // Reference to the rock button
    public paperBtn: RoundedRectangleButton; // Reference to the paper button 
    public scissorsBtn: RoundedRectangleButton; // Reference to the scissor button
    public exitBtn: RoundedRectangleButton; // Reference to the exit button

    private playerWinsAmount: number = 0; // Variable to save the amount of wins of the player
    private playerLosesAmount: number = 0; // Variable to save the amount of loses of the player

    // Awake is called when an enabled script instance is being loaded.
    Awake () {
        // Singleton pattern
        if ( UIManager.instance != null ) GameObject.Destroy( this.gameObject );
        else UIManager.instance = this;
    }

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
    Start () {
        // Call the function to set the logic of the buttons
        this.SetButtonLogic();
    }

    // This function displays the EndPanel and show who is the winner
    ShowEndPanel ( winner: string, playerWins: bool ) {
        // Deactivate the gamePanel
        this.gamePanel.SetActive( false );

        // Activate the endpanel
        this.endPanel.SetActive( true );

        // Call to the EndPanelColorChane function
        this.ChangeEndPanelColor( playerWins );

        // Set the winnertext to the parameter passed
        this.winnerText.text = winner;

        // Check if the player wins and increase the wins o loses amount
        if ( playerWins ) this.playerWinsAmount++;
        else this.playerLosesAmount++;

        // Then set the wins and the loses amount text with the variables
        this.winsAmount.text = this.playerWinsAmount.toString();
        this.losesAmount.text = this.playerLosesAmount.toString();
    }

    // This function shows the draw panel
    ShowDrawEndPanel () {
        // Call the function to show the end panel
        this.ShowPanel( UIPanel.End );

        // Call to the EndPanelColorChane function
        this.ChangeEndPanelColor( false, true );

        // Set the winner text to Draw
        this.winnerText.text = "Draw!";

        // Set the wins and the loses amount text with the variables
        this.winsAmount.text = this.playerWinsAmount.toString();
        this.losesAmount.text = this.playerLosesAmount.toString();
    }

    // This function is responsible for, based on the received parameter, selecting which panel should be displayed while hiding the others.
    ShowPanel ( panel: UIPanel = UIPanel.None ) {
        // Deactivate all the panels
        this.startPanel.SetActive( false );
        this.gamePanel.SetActive( false );
        this.endPanel.SetActive( false );

        // Then switch on the parameter received to active one of them
        switch ( panel )
        {
            case UIPanel.Start:
                // Activate the startPanel
                this.startPanel.SetActive( true );
                break;
            case UIPanel.Game:
                // Activate the gamePanel
                this.gamePanel.SetActive( true );
                break;
            case UIPanel.End:
                // Activate the endPanel
                this.endPanel.SetActive( true );
                break;
            default:
                // If the parameter is none or not defined, also deactivate the exitBtn
                this.exitBtn.gameObject.SetActive( false );
                break;
        }
    }

    // This functions set the scale of the icons of the selection in 0
    public CleanSelections () {
        this.opponentIcon.IconScale = 0;
        this.playerIcon.IconScale = 0;
    }

    // This function is responsible for changing the background color of the EndPanel according to who wins or if there is a tie
    ChangeEndPanelColor ( playerWins: bool, draw: bool = false ) {
        // If there is a draw, then the set the color and stop the progress of the function
        if ( draw )
        {
            this.endPanelBg.color = Color.white;
            return;
        }
        // Check if the player wins and select the correspondent color
        if ( playerWins ) this.endPanelBg.color = this.playerWinColor;
        else this.endPanelBg.color = this.cpuWinColor;
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

        // Deactivate all the panels and the exit button
        this.ShowPanel();
    }

    // This functions sets the sprite of the player hand in the selected one
    public SetPlayerSprite ( selection: number ) {
        // Set the icon of the opponent on the selection based on the array gameSprites
        // this.playerIcon.Icon = this.gameSprites[ selection ];
        this.playerIcon.Icon = this.GetHandSprite( selection );
        this.playerIcon.IconScale = 1.7;
    }

    // This functions sets the sprite of the opponent hand in the selected one
    public SetOpponentSprite ( selection: number ) {
        // Set the icon of the opponent on the selection based on the array gameSprites
        // this.opponentIcon.Icon = this.gameSprites[ selection ];
        this.opponentIcon.Icon = this.GetHandSprite( selection );
        this.opponentIcon.IconScale = 1.7;
    }

    // This function select and return a sprite based on the selection parameter
    GetHandSprite ( selection: Hands ): Sprite {
        if ( selection == Hands.rock ) return this.rockSprite;
        if ( selection == Hands.paper ) return this.paperSprite;
        if ( selection == Hands.scissors ) return this.scissorsSprite;
    }
}