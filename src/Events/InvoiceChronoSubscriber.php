<?php
/**
 * Created by PhpStorm.
 * User: elsha
 * Date: 02/11/19
 * Time: 10:53
 */

namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    /**
     * @var Security
     */
    private $security;
    /**
     * @var InvoiceRepository
     */
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    /**
     * Returns an array of event names this subscriber wants to listen to.
     *
     * The array keys are event names and the value can be:
     *
     *  * The method name to call (priority defaults to 0)
     *  * An array composed of the method name to call and the priority
     *  * An array of arrays composed of the method names to call and respective
     *    priorities, or 0 if unset
     *
     * For instance:
     *
     *  * ['eventName' => 'methodName']
     *  * ['eventName' => ['methodName', $priority]]
     *  * ['eventName' => [['methodName1', $priority], ['methodName2']]]
     *
     * @return array The event names to listen to
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event){
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST"){
            $nexChrono = $this->repository->findNextInvoice($this->security->getUser());
            $invoice->setChrono($nexChrono);

            //TODO : A Deplacer dans une classe dedie
            if (empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }

        }
    }
}