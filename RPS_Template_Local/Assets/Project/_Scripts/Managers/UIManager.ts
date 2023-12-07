import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Color, GameObject, Mathf, Sprite, Time, WaitForSeconds } from 'UnityEngine';
import { RoundedRectangle, RoundedRectangleButton, ZepetoText } from 'ZEPETO.World.Gui';
import GameManager, { Hands } from './GameManager';
import { Image } from 'UnityEngine.UI';

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
    public questionMarkSprite: Sprite; // Reference of the question mark sprite

    public blackout: Image; // Reference to the blackout image

    @Header("Info showing")
    public gameNameObj: GameObject; // Reference to the game name obj
    public counterObj: GameObject; // Reference to the counter
    public counterText: ZepetoText; // Reference to the text of the counter
    public winsLosesObj: GameObject; // Reference to the winsLoses object
    public winsLosesCounter: ZepetoText; // Reference to the counter of wins and loses

    @Header("Panels")
    @SerializeField() startPanel: GameObject; // Reference to the start panel
    @SerializeField() gamePanel: GameObject; // Reference to the game panel 
    @SerializeField() endPanel: GameObject; // Reference to the end panel
    @SerializeField() endPanelBg: RoundedRectangle; // Reference to the end panel background

    @Header("Game")
    @SerializeField() playerIcon: RoundedRectangleButton; // Image references of the Player
    @SerializeField() opponentIcon: RoundedRectangleButton; // Image references of the opponent

    @Header("End screen")
    @SerializeField() winnerText: ZepetoText; // Reference to the winner text
    @SerializeField() winsAmount: ZepetoText; // Reference to the text that have the amount of wins of the player
    @SerializeField() losesAmount: ZepetoText; // Reference to the text that have the amount of loses of the player

    @SerializeField() playerWinColor: Color; // Color to change the background of the end panel when the player wins
    @SerializeField() cpuWinColor: Color; // Color to change the background of the end panel when the player loses

    @Header("Buttons")
    public playBtn: RoundedRectangleButton; // Reference to the play button
    public rockBtn: RoundedRectangleButton; // Reference to the rock button
    public paperBtn: RoundedRectangleButton; // Reference to the paper button 
    public scissorsBtn: RoundedRectangleButton; // Reference to the scissor button
    public exitBtn: RoundedRectangleButton; // Reference to the exit button

    private playerWinsAmount: number = 0; // Variable to save the amount of wins of the player
    private playerLosesAmount: number = 0; // Variable to save the amount of loses of the player

    // Awake is called when an enabled script instance is being loaded.
    Awake() {
        // Singleton pattern
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;
    }

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
    Start() {
        // Call the function to set the logic of the buttons
        this.InitButtonsListeners();
    }

    // This function set the logic of the buttons off the ui
    InitButtonsListeners() {
        // Set the function of the click on the rock button
        this.rockBtn.OnClick.AddListener(() => {
            // Call the function on the GameManager instance to select the hand
            GameManager.instance.SelectPlayerHand(0);

            // Call the function on the GameManager instance to select the opponent hand
            GameManager.instance.SelectOpponentHand();
        });

        // Set the function of the click on the paper button
        this.paperBtn.OnClick.AddListener(() => {
            // Call the function on the GameManager instance to select the hand
            GameManager.instance.SelectPlayerHand(1);

            // Call the function on the GameManager instance to select the opponent hand
            GameManager.instance.SelectOpponentHand();
        });

        // Set the function of the click on the scissors button
        this.scissorsBtn.OnClick.AddListener(() => {
            // Call the function on the GameManager instance to select the hand
            GameManager.instance.SelectPlayerHand(2);

            // Call the function on the GameManager instance to select the opponent hand
            GameManager.instance.SelectOpponentHand();
        });

        // Set the function of the click on the play button
        this.playBtn.OnClick.AddListener(() => {
            // Call to the coroutine to start the game
            this.StartCoroutine(this.WaitToStart());
        });

        // Deactivate all the panels and the exit button
        this.ShowPanel();
    }

    // This function updates the counter of wins and loses of the ui
    UpdateWinLoseCounter() {
        // Replace the text of winsLosesCounter to show the updated number of them
        this.winsLosesCounter.text = this.playerWinsAmount.toString();
    }

    // This function displays the EndPanel and show who is the winner
    ShowEndPanel(winner: string, playerWins: bool) {
        // Deactivate the gamePanel
        this.gamePanel.SetActive(false);

        // Activate the endpanel
        this.endPanel.SetActive(true);

        // Call to the EndPanelColorChane function
        this.ChangeEndPanelColor(playerWins);

        // Set the winnertext to the parameter passed
        this.winnerText.text = winner;

        // Check if the player wins and increase the wins o loses amount
        if (playerWins) this.playerWinsAmount++;
        else this.playerLosesAmount++;

        // Then set the wins and the loses amount text with the variables
        this.winsAmount.text = this.playerWinsAmount.toString();
        this.losesAmount.text = this.playerLosesAmount.toString();

        // Call to the Update wins and loses function
        this.UpdateWinLoseCounter();
    }

    // This function shows the draw panel
    ShowDrawEndPanel() {
        // Call the function to show the end panel
        this.ShowPanel(UIPanel.End);

        // Call to the EndPanelColorChane function
        this.ChangeEndPanelColor(false, true);

        // Set the winner text to Draw
        this.winnerText.text = "Draw!";

        // Set the wins and the loses amount text with the variables
        this.winsAmount.text = this.playerWinsAmount.toString();
        this.losesAmount.text = this.playerLosesAmount.toString();
    }

    // This function is responsible for, based on the received parameter, selecting which panel should be displayed while hiding the others.
    ShowPanel(panel: UIPanel = UIPanel.None) {
        // Deactivate all the panels keeping active the winslosesobj
        this.startPanel.SetActive(false);
        this.gamePanel.SetActive(false);
        this.endPanel.SetActive(false);
        this.winsLosesObj.SetActive(true);

        // Then switch on the parameter received to active one of them
        switch (panel) {
            case UIPanel.Start:
                // Activate the startPanel
                this.startPanel.SetActive(true);
                break;
            case UIPanel.Game:
                // Activate the gamePanel
                this.gamePanel.SetActive(true);
                // Call to the cleanSelections function
                this.CleanSelections();
                break;
            case UIPanel.End:
                // Activate the endPanel
                this.endPanel.SetActive(true);
                break;
            default:
                // If the parameter is none or not defined, also deactivate the exitBtn
                this.exitBtn.gameObject.SetActive(false);
                this.winsLosesObj.SetActive(false);
                break;
        }
    }

    // This functions set the icons of the selections of the players on the base state
    public CleanSelections() {
        // Set the scales on 0.6 and show the question mark on both selections
      //  this.opponentIcon.IconScale = 0.6;
        this.opponentIcon.Icon = this.questionMarkSprite;
      //  this.playerIcon.IconScale = 0.6;
        this.playerIcon.Icon = this.questionMarkSprite;
    }

    // This function is responsible for changing the background color of the EndPanel according to who wins or if there is a tie
    ChangeEndPanelColor(playerWins: bool, draw: bool = false) {
        // If there is a draw, then the set the color and stop the progress of the function
        if (draw) {
            this.endPanelBg.color = Color.white;
            return;
        }
        // Check if the player wins and select the correspondent color
        if (playerWins) this.endPanelBg.color = this.playerWinColor;
        else this.endPanelBg.color = this.cpuWinColor;
    }

    // This function is a Coroutine that shows the counter before start the game
    *WaitToStart() {
        // Set a counter with the variable previously assigned by inspector with the time to start
        let counter: int = GameManager.instance.counterToStart;

        // Call the function of the UIManager to show the number on the text
        this.counterText.text = counter.toString();
        // Deactivate the play button of the UI using the variable of the UIManager
        this.playBtn.gameObject.SetActive(false);
        // Deactivate the game name object of the UI
        this.gameNameObj.SetActive(false);
        // Activate the object of the counter in the UI using the variable of the UIManager
        this.counterObj.SetActive(true);

        // Here we start a loop to count by seconds and show that on the counter object
        while (true) {
            // Here we wait 1 second before continue with the code
            yield new WaitForSeconds(1);

            // We subtract 1 from the counter variable
            counter--;

            // Update the counter text in the UI using the variable of the UIManager
            this.counterText.text = counter.toString();

            // console.log( "Counter: " + counter );

            // We chekc if the counter is 0 then we break the loop to continue with the code
            if (counter == 0) break;
        }

        // Update the counter text to "START!" in the UI using the variable of the UIManager
        this.counterText.text = "START!";

        // Wait for 0.5 seconds to continue, giving sometime to see the "Start!" text
        yield new WaitForSeconds(0.5);

        // Then we need to restart the panles, so we use the instance of the UIManager to:
        // Deactivate the counter object
        this.counterObj.SetActive(false);
        // Activate the play button
        this.playBtn.gameObject.SetActive(true);
        // Activate the game name object
        this.gameNameObj.SetActive(true);
        // Call to the function ShowPanel to activate the game panel
        this.ShowPanel(UIPanel.Game);

        // With this, now we are showing the game panel to start play
        // and we reset the start panel if the player wants to play again
    }

    ResetFadeIn() {
        this.blackout.color = new Color(this.blackout.color.r, this.blackout.color.g, this.blackout.color.b, 0);
    }

    InitFadeIn() {
        // Init the coroutine to show the blackout
        this.StartCoroutine(this.FadeIn());
    }

    *FadeIn() {
        let elapsedTime = 0;
        let fadeDuration = 0.25;
        let maxAlpha = 0.6;
        while (elapsedTime < fadeDuration) {
            let newAlpha = Mathf.Lerp(0, maxAlpha, elapsedTime / fadeDuration);
            this.blackout.color = new Color(this.blackout.color.r, this.blackout.color.g, this.blackout.color.b, newAlpha);
            elapsedTime += Time.deltaTime;
            yield null;
        }

        this.blackout.color = new Color(this.blackout.color.r, this.blackout.color.g, this.blackout.color.b, maxAlpha);
    }

    // This functions sets the sprite of the player hand in the selected one
    public SetPlayerSprite(selection: number) {
        // Set the icon of the opponent on the selection based on the array gameSprites
        // this.playerIcon.Icon = this.gameSprites[ selection ];
        this.playerIcon.Icon = this.GetHandSprite(selection);
     //   this.playerIcon.IconScale = 1.7;
    }

    // This functions sets the sprite of the opponent hand in the selected one
    public SetOpponentSprite(selection: number) {
        // Set the icon of the opponent on the selection based on the array gameSprites
        // this.opponentIcon.Icon = this.gameSprites[ selection ];
        this.opponentIcon.Icon = this.GetHandSprite(selection);
       // this.opponentIcon.IconScale = 1.7;
    }

    // This function select and return a sprite based on the selection parameter
    GetHandSprite(selection: Hands): Sprite {
        if (selection == Hands.Rock) return this.rockSprite;
        if (selection == Hands.Paper) return this.paperSprite;
        if (selection == Hands.Scissors) return this.scissorsSprite;
    }
}