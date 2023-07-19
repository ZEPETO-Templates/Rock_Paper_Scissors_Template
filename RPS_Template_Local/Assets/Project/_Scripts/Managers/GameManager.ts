import { GameObject, Mathf, Random, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIManager, { UIPanel } from './UIManager';

// This class is responsible for handling everything related to the gameplay of the game, calling other managers if necessary.
export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager; // Singleton instance variable

    @SerializeField() counterToStart: number; // Variable to set the waiting time before starting a match.

    private playerSelection: number; // Player selection variable will contain the hand selection of the player
    private opponentSelection: number; // Opponent selection variable will contain the hand selection of the opponent

    // Awake is called when an enabled script instance is being loaded.
    Awake (): void {
        // Singleton pattern
        if ( GameManager.instance != null ) GameObject.Destroy( this.gameObject );
        else GameManager.instance = this;
    }

    // This functions will set the selection of the player hand
    public SelectPlayerHand ( selection: int ) {
        // Call to the function SelectPlayerSprite on the UIManager
        UIManager.instance.SelectPlayerSprite( selection );

        // Set the player selection
        this.playerSelection = selection;

    }

    // This function will select the opponent hand (rock, paper or scissors)
    public SelectOpponentHand () {
        // first we will let the variables to get a random hand

        // Setting the random selection
        let rnd: int = 0;

        // Set the limit on the sprite amount on the UIManager
        let limit: int = 3;

        // Select a random number between 0 and the limit
        rnd = Random.Range( 0, limit );

        // if rnd gets a float as result it gets rounded to int
        rnd = Mathf.FloorToInt( rnd );

        // console.log( "Rnd: " + rnd );

        // Call to the function SelectOpponentSprite on the UIManager
        UIManager.instance.SelectOpponentSprite( rnd );

        // Set the opponent selection to the random selection
        this.opponentSelection = rnd;
        this.Match();
    }

    // This function is responsible for comparing the hands selected by the player and the CPU, determining who will be the winner.
    Match () {
        // console.log( "Player: " + this.playerSelection + " // Opponent: " + this.opponentSelection );

        // We check if both selected the same thing.
        if ( this.playerSelection == this.opponentSelection )
        {
            // We start the coroutine to resolve the situation.
            this.StartCoroutine( this.WaitToResolve( false, true ) );

            // Then stop the function
            return;
        }

        // Set the variable to know if the player wins, letting this on false we only need to check if the player wins and not if he loses
        let playerWins: bool = false;

        // We create a switch to cover the different possible selections of the player.
        switch ( this.playerSelection )
        {
            // In the case that the player has selected "rock"...
            case 0:
                // We check if the opponent selected "scissors" and set the playerWins
                if ( this.opponentSelection == 2 ) { playerWins = true; }
                break;
            // In the case that the player has selected "rock"...
            case 1:
                // We check if the opponent selected "scissors" and set the playerWins
                if ( this.opponentSelection == 0 ) { playerWins = true; }
                break;
            // In the case that the player has selected "scissors"...
            case 2:
                // We check if the opponent selected "paper" and set the playerWins
                if ( this.opponentSelection == 1 ) { playerWins = true; }
                break;
        }

        // We start the coroutine to resolve the situation. 
        this.StartCoroutine( this.WaitToResolve( playerWins ) );

    }

    // This function is a Coroutine that shows the counter before start the game
    *WaitToStart () {
        // Set a counter with the variable previously assigned by inspector with the time to start
        let counter: int = this.counterToStart;

        // Call the function of the UIManager to show the number on the text
        UIManager.instance.counterText.text = counter.toString();
        // Deactivate the play button of the UI using the variable of the UIManager
        UIManager.instance.playBtn.gameObject.SetActive( false );
        // Activate the object of the counter in the UI using the variable of the UIManager
        UIManager.instance.counterObj.SetActive( true );

        // Here we start a loop to count by seconds and show that on the counter object
        while ( true )
        {
            // Here we wait 1 second before continue with the code
            yield new WaitForSeconds( 1 );

            // We subtract 1 from the counter variable
            counter--;

            // Update the counter text in the UI using the variable of the UIManager
            UIManager.instance.counterText.text = counter.toString();

            // console.log( "Counter: " + counter );

            // We chekc if the counter is 0 then we break the loop to continue with the code
            if ( counter == 0 ) break;
        }
        // Update the counter text to "START!" in the UI using the variable of the UIManager
        UIManager.instance.counterText.text = "START!";

        // Wait for 0.5 seconds to continue, giving sometime to see the "Start!" text
        yield new WaitForSeconds( 0.5 );

        // Then we need to restart the panles, so we use the instance of the UIManager to:
        // Deactivate the counter object
        UIManager.instance.counterObj.SetActive( false );
        // Activate the play button
        UIManager.instance.playBtn.gameObject.SetActive( true );

        // Call to the function ShowPanel to activate the game panel
        UIManager.instance.ShowPanel( UIPanel.Game );

        // With this, now we are showing the game panel to start play
        // and we reset the start panel if the player wants to play again
    }

    // This function is a coroutine that handles resolving the winner, resetting the selections, and passing some time to the winner later on
    *WaitToResolve ( playerWins: bool, draw: bool = false ) {
        // Here we wait 1 second before continue with the code
        yield new WaitForSeconds( 1 );

        // We check if there was a tie based on the obtained parameters.
        if ( draw )
        {
            // Call to the CleanSelections function of the UIManager instance
            UIManager.instance.CleanSelections();

            // Call to the ShowDrawEndPanel function of the UIManager instance
            UIManager.instance.ShowDrawEndPanel();

            // Stop the execution of the function.
            return;
        }

        // Call to the CleanSelections function of the UIManager instance
        UIManager.instance.CleanSelections();

        // We check if the player won. If so, we call the "ShowEndPanel" function from the UIManager instance.
        // Passing as parameters the text to be displayed for the winner and a boolean that determines if the player won or not.
        // If not, we will call the same function but specifying that the winner was the CPU.
        if ( playerWins ) UIManager.instance.ShowEndPanel( "Player", true );
        else UIManager.instance.ShowEndPanel( "CPU", false );

    }
}
