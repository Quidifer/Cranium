import React from "react";
let Logo = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.today.com%2Fpopculture%2Fbreaking-bads-walter-white-how-we-hate-you-root-you-6C10875238&psig=AOvVaw216bWTa-ab2PvJhNFYTs-Y&ust=1678167112333000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCJCesefJxv0CFQAAAAAdAAAAABAD"
export default class FirstComponent {
    render() {
        return (
            <div >
                <h3 >A Simple React Component Example with Typescript</h3>
                <div>
                    <img height ="250" src ={Logo} />
                </div>
                <p>This component shows Walter Blanco</p>
                <p>For more info on Logrocket, please visit cranium website lel</p>
            </div>
        )
    }
}