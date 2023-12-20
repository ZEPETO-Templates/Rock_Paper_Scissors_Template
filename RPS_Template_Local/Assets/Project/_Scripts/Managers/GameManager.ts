import { GameObject, Mathf, Random, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIManager, { UIPanel } from './UIManager';

// Enum with the posibles hands to select
export enum Hands {
    Rock, Paper, Scissors
}

// This class is responsible for handling everything related to the gameplay of the game, calling other managers if necessary
export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager; // Singleton instance variable

    private playerSelection: Hands; // Player selection variable will contain the hand selection of the player
    private opponentSelection: Hands; // Opponent selection variable will contain the hand selection of the opponent

    // Awake is called when an enabled script instance is being loaded
    Awake (): void {
        // Singleton pattern
        if ( GameManager.instance != null ) GameObject.Destroy( this.gameObject );
        else GameManager.instance = this;
    }

    // This functions will set the selection of the player hand
    public SelectPlayerHand ( selection: number ) {
        // Call to the function SelectPlayerSprite on the UIManager
        UIManager.instance.SetPlayerSprite( selection );

        // Set the player selection
        this.playerSelection = selection;
    }

    // This function will select the opponent hand (rock, paper or scissors)
    public SelectOpponentHand () {
        // first we will let the variables to get a random hand

        // Setting the random selection
        let rnd: int = 0;

        // Select a random number between 0 and the max ammount of options (In this case 3)
        rnd = Random.Range( 0, 3 );

        // if rnd gets a float as result it gets rounded to int
        rnd = Mathf.FloorToInt( rnd );

        // Set the opponent selection to the random selection
        this.opponentSelection = rnd;

        // Call to the function SelectOpponentSprite on the UIManager
        UIManager.instance.SetOpponentSprite( rnd );

        // Evaluate this match
        this.CompareHands();
    }

    // This function is responsible for comparing the hands selected by the player and the CPU, determining who will be the winner.
    CompareHands () {
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
            case Hands.Rock:
                // We check if the opponent selected "scissors" and set the playerWins
                if ( this.opponentSelection == Hands.Scissors ) { playerWins = true; }
                break;
            // In the case that the player has selected "paper"...
            case Hands.Paper:
                // We check if the opponent selected "scissors" and set the playerWins
                if ( this.opponentSelection == Hands.Rock ) { playerWins = true; }
                break;
            // In the case that the player has selected "scissors"...
            case Hands.Scissors:
                // We check if the opponent selected "paper" and set the playerWins
                if ( this.opponentSelection == Hands.Paper ) { playerWins = true; }
                break;
        }

        // We start the coroutine to resolve the situation. 
        this.StartCoroutine( this.WaitToResolve( playerWins ) );

    }

    // This function is a coroutine that handles resolving the winner, resetting the selections, and passing some time to the winner later on
    *WaitToResolve ( playerWins: bool, draw: bool = false ) {
        // Here we wait 2 seconds before continue with the code
        yield new WaitForSeconds( 2 );

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
