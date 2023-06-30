import { GameObject, Mathf, Random, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIManager from './UIManager';

export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager; // Singleton instance variable

    @SerializeField() counterToStart: number;

    private playerSelection: number; // Player selection variable will contain the hand selection of the player
    private opponentSelection: number; // Opponent selection variable will contain the hand selection of the opponent

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

    Match () {
        // console.log( "Player: " + this.playerSelection + " // Opponent: " + this.opponentSelection );

        if ( this.playerSelection == this.opponentSelection )
        {
            this.StartCoroutine( this.WaitToResolve( false, true ) );
            return;
        }

        let playerWins: bool = false;

        switch ( this.playerSelection )
        {
            case 0:
                if ( this.opponentSelection == 2 ) { playerWins = true; }
                break;
            case 1:
                if ( this.opponentSelection == 0 ) { playerWins = true; }
                break;
            case 2:
                if ( this.opponentSelection == 1 ) { playerWins = true; }
                break;
        }

        this.StartCoroutine( this.WaitToResolve( playerWins ) );

    }

    *WaitToStart () {
        let counter: int = this.counterToStart;
        UIManager.instance.counterText.text = counter.toString();
        UIManager.instance.playBtn.gameObject.SetActive( false );
        UIManager.instance.counterObj.SetActive( true );
        while ( true )
        {
            yield null;
            yield new WaitForSeconds( 1 );

            counter--;
            UIManager.instance.counterText.text = counter.toString();
            // console.log( "Counter: " + counter );

            if ( counter == 0 ) break;
        }
        UIManager.instance.counterText.text = "START!";
        yield new WaitForSeconds( 0.5 );
        UIManager.instance.counterObj.SetActive( false );
        UIManager.instance.playBtn.gameObject.SetActive( true );
        UIManager.instance.startPanel.SetActive( false );
        UIManager.instance.gamePanel.SetActive( true );

    }

    *WaitToResolve ( playerWins: bool, draw: bool = false ) {
        yield new WaitForSeconds( 1 );
        if ( draw )
        {
            UIManager.instance.CleanSelections();
            UIManager.instance.ShowDrawEndPanel();
            return;
        }

        UIManager.instance.CleanSelections();
        if ( playerWins ) UIManager.instance.ShowEndPanel( "Player", true );
        else UIManager.instance.ShowEndPanel( "CPU", false );

    }
}
