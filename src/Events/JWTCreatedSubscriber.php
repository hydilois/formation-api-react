<?php
/**
 * Created by PhpStorm.
 * User: elsha
 * Date: 02/11/19
 * Time: 11:40
 */

namespace App\Events;


use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedSubscriber
{
    public function updateJWTData(JWTCreatedEvent$event){
        /* @var $user User*/
        $user = $event->getUser();

        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();
        $event->setData($data);
    }
}